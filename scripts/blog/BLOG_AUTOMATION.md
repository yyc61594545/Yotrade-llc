# YoTrade 博客每日自动发布规范

> 远程 Claude agent 每次运行时**必须从头读这个文件**。这里有发布一篇文章需要的全部约束、模板、命令。

## 0. 目标

每天产出 **1 篇**新博客文章，发到 `https://github.com/yyc61594545/Yotrade-llc` main 分支，触发 Vercel 自动部署到 https://www.yotradellc.com。

## 1. 仓库与环境

| 项目 | 值 |
|---|---|
| Repo | `yyc61594545/Yotrade-llc` |
| 框架 | Next.js 15 + Fumadocs MDX |
| 博客目录 | `content/blog/` |
| 文章命名 | `{english-slug}.zh.mdx`（locale = zh） |
| 封面目录 | `public/images/blog/` |
| 封面命名 | `{english-slug}-cover.png` |
| 分类目录 | `content/category/`（现有：`us-business`、`hk-bank`、`company`、`product`、`news`、`payments`、`guide`） |
| 作者目录 | `content/author/`（现有：`fox`、`mkdirs`、`mksaas`、`jikejieni`） |
| 部署平台 | Vercel（push 到 main 自动部署） |

## 2. 选题策略

### 2.1 业务对齐

YoTrade 四大业务板块（按导流优先级）：

| 板块 | 服务页 | 关联话题 |
|---|---|---|
| **代办** | `/services/daiban` | ITIN, LLC, 美国银行账户, EIN, 美卡申请, 报税合规 |
| **代刷** | `/services/daishua` | AI 订阅, 海外 SaaS, 跨境支付限制, Apple ID 切区 |
| **代购** | `/services/daigou` | 海外商品代买, 限定款, 球鞋, 化妆品 |
| **代买** | `/services/daimai` | 国外平台限定款下单 |

每篇文章**必须**自然导流到至少一个业务板块的服务页。

### 2.2 选题来源（优先级从高到低）

1. **uscreditcardguide.com**（美卡论坛）—— 最新政策变动、开卡奖励变化、银行规则
2. **caylet.com**（NRA 视角）—— LLC + 美卡的实战案例
3. **WebSearch** —— 最近 30 天的"跨境支付"、"NRA 申美卡"、"ChatGPT 订阅" 等热门话题
4. **uscreditcardguide.com/zh/?utm_source=forum**（论坛热帖）—— 用户痛点

### 2.3 去重规则（必须执行）

**写文章前必读** `content/blog/` 下的所有 `*.zh.mdx` 文件名，避免主题重复。

判定"重复"：标题或 slug 关键词**重叠 ≥ 60%**视为重复。例如：
- ❌ 已有 `itin-application-complete-guide` → 不能再写 "ITIN 申请详解"
- ✅ 已有 ITIN 总论 → 可以写 "ITIN W-7 表格 8 大理由代码详解"（深度细分）

### 2.4 内容多样性

**严禁**连续 3 天都发同一板块（如连续 3 天都是 ITIN/LLC/银行）。每天发布前看下最近 7 天发的板块分布，主动选**最缺的板块**。

### 2.5 时效要求

- 涉及具体金额、开卡奖励、政策的，必须**核实是 90 天内**的数据
- 引用"最新"、"2026"等词时，确保数据真实

## 3. 文章模板

### 3.1 Frontmatter（严格遵守 schema）

```yaml
---
title: 标题（含主关键词 + 年份）
description: 1-2 句话总结，含 SEO 关键词，控制 80-160 字
image: /images/blog/{slug}-cover.png
date: "YYYY-MM-DD"
published: true
categories: [primary-category, guide]
author: 极客杰尼
---
```

⚠️ **绝对不要加 `premium: true`**。博客的作用是 SEO 引流获客（搜索用户进来看全文 → 转化为代办/代刷客户），不是卖文章会员。加 premium 会触发付费墙，挡住搜索流量，与引流目标直接冲突。

`primary-category` 取值：
- ITIN / LLC / 银行 / 美卡 → `us-business`
- 港卡 / Stripe → `hk-bank`
- AI 订阅 / 代刷 → `payments`

### 3.2 文章骨架（参照 `content/blog/itin-application-complete-guide.zh.mdx`）

```markdown
> 本文整理自 YoTrade 实操经验 + [素材源 1] + [素材源 2]。预计阅读时长 X 分钟。

## 谁需要看这篇？

- [目标用户群 1]
- [目标用户群 2]
...

---

## [核心概念解释]

## [主体内容 — 3-5 个 H2 章节，含表格、对比、avoid pitfalls]

### [子标题用 H3]

⚠️ **风险点**：...
✅ **推荐做法**：...
💡 **YoTrade 实战观察**：...

---

## 决策矩阵 / 总结

```
[ASCII 表 或 markdown 表格]
```

## YoTrade 相关服务

我们提供：
- 🎯 [服务点 1]
- 🎯 [服务点 2]

👉 [咨询 XXX 服务](/services/{daiban|daishua|daigou|daimai}) | [查看打包方案](/services/daiban)

---

## 相关阅读

- [现有文章 1]({slug-1})
- [现有文章 2]({slug-2})

---

*本文信息基于 YYYY 年 MM 月最新政策。本文不构成金融或法律建议。*
```

### 3.3 字数与质感

- 目标 **2500-3500 中文字**
- 至少 3 个表格 / 决策矩阵 / 对比框
- 至少 5 处 emoji 强调（💡 ⚠️ ✅ ❌ 🎯 📌）
- 中英文术语混排：`Stripe`、`ITIN`、`Mercury`、`Chase` 保留英文，其他用中文

### 3.4 内链规范

每篇文章**必须**在"相关阅读"或正文中链接 ≥ 2 篇现有文章，强化内链矩阵。

## 4. 封面图

### 4.1 生成命令

```bash
python3 scripts/blog/gen_blog_cover.py "{slug}" "{title-line-1}" "{title-line-2}" "{subtitle}"
```

- `title-line-1` 和 `title-line-2`：标题分两行写，每行 4-6 个汉字最佳
- `subtitle`：副标题，10-15 个汉字
- 输出：`public/images/blog/{slug}-cover.png`

### 4.2 依赖

```bash
pip install pillow
sudo apt-get install -y fonts-noto-cjk  # Linux 远程环境必装
```

### 4.3 示例

```bash
python3 scripts/blog/gen_blog_cover.py \
    "amex-platinum-2026-review" \
    "AmEx 白金卡" \
    "2026 测评" \
    "$200 报销 + 600+ 价值"
```

## 5. 发布流程（必须按顺序）

```bash
# 假设 SLUG=amex-platinum-2026-review
cd $(git rev-parse --show-toplevel)
git checkout main
git pull origin main

git checkout -b "blog/daily-$(date +%Y%m%d)-${SLUG}"

# 1. 写文章
# 编辑 content/blog/${SLUG}.zh.mdx

# 2. 生成封面
python3 scripts/blog/gen_blog_cover.py "${SLUG}" "标题1" "标题2" "副标题"

# 3. 提交
git add content/blog/${SLUG}.zh.mdx public/images/blog/${SLUG}-cover.png
git commit -m "docs(blog): ${TITLE}

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"

# 4. push + PR + 自动 merge
git push -u origin "blog/daily-$(date +%Y%m%d)-${SLUG}"

gh pr create --base main \
    --title "docs(blog): ${TITLE}" \
    --body "Daily auto-published post. Sources: ${SOURCES}"

gh pr merge --squash --delete-branch
```

## 6. 红线（违反任何一条 = 失败）

- ❌ 不能直接 push 到 main（必须走 PR + auto merge）
- ❌ 不能改任何**已发布的旧文章**（即 `content/blog/` 下既有的 .mdx）
- ❌ 不能编造数据（金额、政策、奖励）—— 没有可验证的来源就放弃这个选题
- ❌ 不能发同一板块连续 3 天
- ❌ 不能发涉及"币价预测"、"必赚"、"100x"、政治、宗教的内容
- ❌ 一天只发 1 篇（不能 0 篇也不能 2 篇）；若找不到合格选题，开 issue `no-publish: YYYY-MM-DD` 并描述失败原因

## 7. 失败处理

如果以下任一步骤失败：

- 找不到合格选题（去重后剩余的话题都没有 90 天内素材）
- 封面生成失败（字体缺失、依赖未装）
- PR 合并失败（merge conflict、Vercel build fail）

→ 不要硬推。开一个 GitHub issue 报告：

```bash
gh issue create \
    --title "no-publish: $(date +%Y-%m-%d)" \
    --body "Attempted topics: ...\nBlocker: ..."
```

## 8. 已发布文章列表（参考）

读 `content/blog/` 目录确认最新清单。截至本文档最后更新（2026-05-27），已发布的英文 slug 包括：

- `itin-application-complete-guide`
- `nra-us-llc-state-comparison`
- `us-business-banking-mercury-relay-wise`
- `nra-us-credit-card-12-month-roadmap`
- `amex-chase-financial-review-risk-control`
- `ai-subscription-payment-paths`
- `hk-bank-card-guide`
- 其他港卡 / Stripe 系列（中文文件名，主题：港卡办理、Stripe 开通）

## 9. 候选选题池（参考，不限于此）

代办板块：
- ITIN W-7 八大理由代码详解
- 美国 LLC 5472 报税完全指南（$25k 罚款警示）
- Stripe Atlas vs 自注册 LLC 横评
- EIN 申请：传真 vs 邮寄 vs Form SS-4 在线
- Sole Proprietor vs LLC 申商业卡差异
- Wyoming LLC 续费与年报实操
- W-8BEN 表格填写完全指南
- Apple Card 给 NRA 的实战路径

美卡板块：
- Chase Sapphire Reserve 改版深度分析
- AmEx Gold 1 年实测：$350 年费回不回本
- Chase Ink 商业卡：哪张性价比最高
- Capital One Venture X vs AmEx Platinum 横评
- 5/24 规则下的最优申卡顺序更新
- 美卡返现卡 vs 点数卡：哪个更适合 NRA
- Bilt Mastercard 给 NRA：能不能玩
- Robinhood Gold $200 转点活动深度解析

代刷板块：
- Claude Pro 海外升级 Max 完整流程
- Cursor Pro 团队版年付优惠
- Midjourney 个人 vs 团队版差异
- Suno V4 订阅与 API 价格对比
- ChatGPT Team 5 人开通教程
- GitHub Copilot Business 给国内开发者

港卡板块（与现有系列接轨）：
- 蚂蚁银行（ZA Bank 替代）开户指南
- 渣打 Mox 开户实操
- 港股账户：富途 / 老虎 / 盈透横评
- 港卡转账到 Wise 完整流程

## 10. 模型与上下文

- 文章质量优先：建议使用 `claude-opus-4-7` 写文章（如果模型可用）
- 单次运行预算：~30K tokens（含 WebFetch 抓素材 + 写文章）
- 写完一篇后**立即** push + merge，不要积累多篇等批量

---

*Last updated: 2026-05-27. 修改本规范请提 PR 标题前缀 `infra(blog):`。*
