#!/bin/bash
# yotradellc.com 日更驱动：Claude 优先，Codex 兜底。
#
# 背景：2026-09-11 之前这条线跑在 claude.ai 云端 routine 上（PR body 里留着
# https://claude.ai/code/session_01... 的痕迹）。老账号 09-12 被 hold 后 routine
# 随账号一起消失，日更断了 5 天。2026-09-16 重建为本地任务，并加上 Codex 兜底
# —— 姊妹站 yotrade-blog 正是靠这个兜底在同一次账号事故里活下来的。
#
# 与 yotrade-blog 的关键差异：那边推完分支就交给 GitHub Actions 合并部署；
# 这个仓库没有 autopublish workflow，且 main 上挂着 ruleset
# "Require typecheck on main"（必需检查 typecheck、strict、无 bypass），
# 所以只能走 PR：本脚本自己等 typecheck 绿了再 squash 合并。Vercel 跟 main 自动部署。
#
# 由 ~/Library/LaunchAgents/com.ethan.yotradellc-blog-daily.plist 每天 09:30 触发
# （错开 yotrade-blog 的 09:00，避免两个 agent 抢 API 配额）。

set -uo pipefail

# launchd 能唤醒 Mac 跑任务，但没人持电源断言的话系统约一分钟后就睡回去，
# 长连接的 agent 会被打断（yotrade-blog 2026-08-21~23 连死三天就是这个原因）。
if [ -z "${CAFFEINATED:-}" ]; then
  export CAFFEINATED=1
  exec /usr/bin/caffeinate -i -s "$0" "$@"
fi

REPO="/Users/ethan/Projects/Yotrade-llc"
AGENT_TIMEOUT=3600          # 单个 agent 最多 1 小时
CHECK_TIMEOUT=900           # 等 typecheck 最多 15 分钟
NOTIFY="/Users/ethan/wuyun-shenghuo/happy-hellman-f65c59/scripts/notify-telegram.py"

# launchd 不继承登录 shell 的环境。这台机器直连 DNS 不通，
# gh 出网全靠 Surge 的本地代理，丢了就报 "Resolving timed out"。
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/Users/ethan/.npm-global/bin:/Users/ethan/.local/bin:/Users/ethan/Library/pnpm:$PATH"
export HOME="/Users/ethan"
export HTTP_PROXY="http://127.0.0.1:6152"
export HTTPS_PROXY="http://127.0.0.1:6152"
export NO_PROXY="localhost,127.0.0.1,::1,.local"

# DATE_OVERRIDE 用于补发历史日期（如 DATE_OVERRIDE=2026-09-12），平时不设。
DATE="${DATE_OVERRIDE:-$(date +%F)}"          # 2026-09-16
YMD=$(echo "$DATE" | tr -d '-')               # 20260916
# 日志放在仓库外：agent 有时会 git add -A，放进仓库就会被扫进文章 commit；
# 而 .gitignore 受版本控制，agent 失败时的硬回滚会把它一并改回去。
LOG_DIR="$HOME/Library/Logs/yotradellc-blog"
mkdir -p "$LOG_DIR"
LOG="$LOG_DIR/daily-$DATE.log"
exec >>"$LOG" 2>&1

log() { echo "[$(date '+%H:%M:%S')] $*"; }

notify() {
  [ -f "$NOTIFY" ] || return 0
  [ -f "$HOME/.config/automation/credentials.env" ] && . "$HOME/.config/automation/credentials.env"
  python3 "$NOTIFY" "$1" >/dev/null 2>&1 || true
}

cd "$REPO" || { log "FATAL: 进不去 $REPO"; exit 1; }

log "===== 日更开始 $DATE ====="

if ! git fetch origin --prune --quiet; then
  log "FATAL: git fetch 失败，网络或代理有问题"
  notify "❌ yotradellc 日更 $DATE：git fetch 失败，没开跑"
  exit 1
fi

# ---------- 幂等 ----------
# FORCE=1 跳过（人工实测用）；DATE_OVERRIDE 用于补发历史日期
if [ "${FORCE:-0}" != "1" ]; then
  if git ls-remote --heads origin "blog/daily-$YMD*" | grep -q .; then
    log "origin 上已有 blog/daily-$YMD* 分支，跳过"
    exit 0
  fi
  if git grep -q "date: \"$DATE\"" origin/main -- content/blog/ 2>/dev/null; then
    log "main 上今天已有成稿，跳过"
    exit 0
  fi
else
  log "FORCE=1，跳过幂等检查"
fi

git checkout --quiet main && git pull --quiet --ff-only || {
  log "FATAL: 切回 main / pull 失败"
  notify "❌ yotradellc 日更 $DATE：本地 main 同步失败"
  exit 1
}

# ---------- 把已写好的 commit 推上去 ----------
# 不管 agent 是自己开了分支还是半途死在 main 上，只要有领先 origin/main 的 commit
# 就抢救出去。返回 0=推送成功 1=没有可推的 commit 2=有稿子但推不上去
ensure_pushed() {
  local ahead branch slug
  ahead=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)
  [ "$ahead" -eq 0 ] && return 1

  branch=$(git branch --show-current)
  if [ "$branch" = "main" ]; then
    # agent 没自己开分支。从新增的 mdx 文件名反推 slug，拼出符合历史命名的分支。
    slug=$(git diff --name-only --diff-filter=A origin/main..HEAD -- content/blog/ \
           | head -1 | sed 's|.*/||; s|\.zh\.mdx$||')
    branch="blog/daily-$YMD${slug:+-$slug}"
    git checkout --quiet -b "$branch" || return 2
    git branch -f main origin/main   # 本地 main 回到干净状态
  fi

  log "分支 $branch 领先 main $ahead 个 commit，推送中"
  for i in 1 2 3; do
    if git push --quiet -u origin "$branch"; then
      log "push 成功：$branch"
      BRANCH="$branch"
      return 0
    fi
    log "push 第 $i 次失败，30s 后重试"
    sleep 30
  done
  log "push 三次都失败"
  return 2
}

# ---------- PR + 等门禁 + 合并 ----------
# main 的 ruleset 要求 typecheck 通过且无 bypass，所以必须走 PR。
# Actions 不能代劳：GITHUB_TOKEN 开的 PR 不触发 workflow，typecheck 永远不会出现，
# PR 会被 ruleset 永久卡住（这个仓库 PR #33 已经踩过一次）。
publish() {
  local title
  if ! gh pr view "$BRANCH" --json number >/dev/null 2>&1; then
    title=$(git log -1 --pretty='%s')
    log "创建 PR：$title"
    gh pr create --base main --head "$BRANCH" \
      --title "$title" \
      --body "Daily auto-published post.

由 scripts/daily-run.sh 自动生成（$DATE）。详见 .claude/commands/daily-post.md。" \
      || { log "gh pr create 失败"; return 1; }
  else
    log "PR 已存在（agent 自己开的），直接用"
  fi

  if [ "${NO_MERGE:-0}" = "1" ]; then
    log "NO_MERGE=1，PR 已开但不合并，交人工审阅"
    return 0
  fi

  # main 上的 ruleset 是 strict：分支落后于 base 就不给合（2026-09-22 日更因此失败过一次）。
  # update-branch 会 no-op 或推一个 merge commit，两种情况都不该中断日更。
  if gh pr update-branch "$BRANCH" >/dev/null 2>&1; then
    log "分支已更新到最新 main"
    sleep 5
  fi

  log "等 typecheck（最多 $((CHECK_TIMEOUT/60)) 分钟）"
  if ! timeout "$CHECK_TIMEOUT" gh pr checks "$BRANCH" --watch --fail-fast; then
    log "typecheck 未通过或超时，PR 保留待人工处理"
    return 1
  fi

  # 合并前先记下新文章 slug（合并后分支会被删掉）
  local slugs
  slugs=$(git diff --name-only --diff-filter=A origin/main..."$BRANCH" -- content/blog/ \
          | sed -n 's|.*/||; s|\.zh\.mdx$||p' | tr '\n' ' ')

  log "typecheck 绿，squash 合并"
  if ! gh pr merge "$BRANCH" --squash --delete-branch; then
    log "合并被拒，更新分支后再试一次"
    gh pr update-branch "$BRANCH" >/dev/null 2>&1 || true
    if ! timeout "$CHECK_TIMEOUT" gh pr checks "$BRANCH" --watch --fail-fast; then
      log "重跑的 typecheck 未通过，PR 保留待人工处理"
      return 1
    fi
    gh pr merge "$BRANCH" --squash --delete-branch || { log "合并失败"; return 1; }
  fi
  log "已合并到 main，Vercel 接管部署"

  # IndexNow：本站 Bing 流量为 0（2026-09 数据），新文章上线后主动推给 Bing。
  # 失败只记日志，不影响本次日更结果。
  if [ -n "$slugs" ]; then
    log "等 Vercel 部署后通知 IndexNow：$slugs"
    python3 "$REPO/scripts/indexnow.py" --wait $slugs 2>&1 | while read -r l; do log "$l"; done
  fi

  # 清旧部署：Vercel Hobby 的 10 GB Deployment Storage 没有自动保留策略，
  # 一天两个部署（preview + production）一个月就吃到 88%（2026-09-21 实测）。
  # 失败只记日志：token 过期或没装 CLI 都不该影响日更结果。
  log "清理 Vercel 旧部署，只留最新 3 个 production"
  python3 "$REPO/scripts/vercel-prune-deployments.py" --keep 3 --yes 2>&1 \
    | while read -r l; do log "$l"; done

  return 0
}

# ---------- agent ----------
run_claude() {
  command -v claude >/dev/null || { log "claude CLI 不在 PATH"; return 1; }
  log "尝试 Claude Code"
  timeout "$AGENT_TIMEOUT" claude -p "/daily-post" \
    --permission-mode acceptEdits 2>&1 | tail -40
  return "${PIPESTATUS[0]}"
}

run_codex() {
  command -v codex >/dev/null || { log "codex CLI 不在 PATH"; return 1; }
  log "降级到 Codex"
  # --approve-for-me 已隐含 workspace-write，不能再传 --sandbox（冲突报错）。
  # --cd 让工作根就是仓库，这是 yotrade-blog 那边 "Operation not permitted" 的解药。
  timeout "$AGENT_TIMEOUT" codex exec \
    --cd "$REPO" \
    --approve-for-me \
    "读仓库根目录 AGENTS.md（日更规范真源）和 CLAUDE.md，按 AGENTS.md 的规范跑 $DATE 的日更，产出 1 篇。推送分支并开 PR 后即结束，不要合并。" 2>&1 | tail -40
  return "${PIPESTATUS[0]}"
}

BRANCH=""
for agent in claude codex; do
  if [ "$agent" = "claude" ]; then run_claude; rc=$?
  else                             run_codex;  rc=$?
  fi
  log "$agent 退出码 $rc"

  ensure_pushed; pushrc=$?
  case "$pushrc" in
    0)
      if publish; then
        log "===== 完成：$agent 写了 1 篇，已合并上线 ====="
        notify "✅ yotradellc 日更 $DATE：$agent 写了 1 篇，已合并，Vercel 部署中"
        exit 0
      fi
      log "===== 中止：稿子已合入 PR 但未合并 ====="
      notify "⚠️ yotradellc 日更 $DATE：$agent 写完并开了 PR，但门禁未过/合并失败，需人工处理。日志 $LOG"
      exit 1
      ;;
    2)
      # 稿子在本地但推不上去。保留现场，不要换 agent 重写一遍。
      log "===== 中止：稿子已写好但推送失败，现场保留在本地分支 ====="
      notify "⚠️ yotradellc 日更 $DATE：$agent 写完了但 push 失败，稿子留在本地。日志 $LOG"
      exit 1
      ;;
    *)
      log "$agent 没产出可推送的 commit"
      git reset --quiet --hard origin/main
      git checkout --quiet main 2>/dev/null
      ;;
  esac
done

log "===== 失败：Claude 和 Codex 都没产出 ====="
notify "❌ yotradellc 日更 $DATE：Claude 和 Codex 都失败，0 篇。日志 $LOG"
exit 1
