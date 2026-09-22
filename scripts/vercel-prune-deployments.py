#!/usr/bin/env python3
"""清理 yotradellc 在 Vercel 上的旧部署，释放 Hobby 的 10 GB Deployment Storage。

保留最新 N 个 Production 部署（默认 3，含当前挂域名的那个），删掉其余全部
Production 与所有 Preview 部署。用本机 `vercel login` 后的 token，不需要额外配置。

用法：
    python3 scripts/vercel-prune-deployments.py            # 只列出将删除的，不动
    python3 scripts/vercel-prune-deployments.py --yes      # 真删
    python3 scripts/vercel-prune-deployments.py --keep 5 --yes

背景：每次 PR 会产生 1 个 Preview + 1 个 Production 部署，各 ~300 MB（2026-09-21 之前
封面是 PNG），日更一个月就把 10 GB 吃到 88%。Hobby 没有自动保留策略，只能手动清。
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import time
import urllib.request

TEAM = "team_UPFPxL1wse9mzreXcTW9maKC"  # yotrade
PROJECT = "prj_4j9Jq2Liqh9p06PzdUQEM61iEDop"  # yotrade-llc-rq28
AUTH = os.path.expanduser("~/Library/Application Support/com.vercel.cli/auth.json")


def token() -> str:
    """auth.json 里的 access token 会过期轮换（带 expiresAt + refreshToken），
    直接读文件经常撞到已失效的那一份并拿到 403 invalidToken。
    先跑一次 `vercel whoami` 让 CLI 用 refreshToken 换新，再读。"""
    try:
        subprocess.run(
            ["vercel", "whoami"], capture_output=True, timeout=60, check=False
        )
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass  # 没装 CLI 或超时就直接碰运气读文件
    try:
        return json.load(open(AUTH))["token"]
    except Exception:
        sys.exit("读不到 Vercel token，先跑一次 `vercel login`")


def api(method: str, url: str, tok: str):
    req = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {tok}", "User-Agent": "curl/8.7.1"},
        method=method,
    )
    with urllib.request.urlopen(req) as r:
        return json.load(r) if method == "GET" else None


def list_deployments(tok: str) -> list[dict]:
    deps: list[dict] = []
    url = f"https://api.vercel.com/v6/deployments?projectId={PROJECT}&teamId={TEAM}&limit=100"
    while url:
        r = api("GET", url, tok)
        deps += r["deployments"]
        nxt = r.get("pagination", {}).get("next")
        url = f"https://api.vercel.com/v6/deployments?projectId={PROJECT}&teamId={TEAM}&limit=100&until={nxt}" if nxt else None
    return deps


def main(argv: list[str]) -> int:
    keep_n = int(argv[argv.index("--keep") + 1]) if "--keep" in argv else 3
    do_it = "--yes" in argv
    tok = token()

    try:
        deps = list_deployments(tok)
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            sys.exit(
                "Vercel 拒绝了 token（403 invalidToken）。"
                "跑一次 `vercel login` 后重试；若刚登录过，直接重跑本脚本即可。"
            )
        raise
    prod = sorted((d for d in deps if d.get("target") == "production"), key=lambda d: -d["created"])
    keep = {d["uid"] for d in prod[:keep_n]}
    todel = [d for d in deps if d["uid"] not in keep]

    print(f"共 {len(deps)} 个部署：保留最新 {len(keep)} 个 Production，删除 {len(todel)} 个")
    for d in prod[:keep_n]:
        print("  保留", d["url"])
    if not do_it:
        print("（预览模式，加 --yes 才会真删）")
        return 0

    ok = fail = 0
    for d in todel:
        try:
            api("DELETE", f"https://api.vercel.com/v13/deployments/{d['uid']}?teamId={TEAM}", tok)
            ok += 1
        except urllib.error.HTTPError as e:
            fail += 1
            print("  失败", d["url"], e.code)
        time.sleep(0.2)
    print(f"删除完成：成功 {ok}，失败 {fail}")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
