# AGENTS.md — yotradellc.com 仓库的 agent 作业规范

本仓库当前唯一的自动化作业是**博客日更**，由 `scripts/daily-run.sh` 驱动
（launchd `com.ethan.yotradellc-blog-daily`，每天 09:30 本地时间）。

Claude 通过 `/daily-post` 进入，Codex 直接读本文件。两者规范完全一致，以本文件为准。

---


产出 **1 篇** 中文长文，落在 `content/blog/<slug>.zh.mdx`，推到 `blog/daily-YYYYMMDD-<slug>` 分支。

> 本规范由 2026-09-16 从既有 84 篇成稿 + 历史 PR body 反推重建。
> 原调度器是 claude.ai 云端 routine（随老账号失效），提示词已不可考，以本文件为准。

## 一、选题

**板块轮换**（看 `git log -8 --pretty='%s' -- content/blog`，避免连发同板块）：

| categories | 覆盖内容 | CTA 落点 |
|---|---|---|
| `[us-business, guide]` | LLC / EIN / ITIN / 报税 / 美卡 / 银行开户 | `/services/daiban` |
| `[payments, guide]` | 海外订阅、会员充值、支付路径 | `/services/daifu` |
| `[payments, guide]` | 海淘代购、球鞋抽签、限量好物 | `/services/daigou` 或 `/services/daimai` |
| `[travel, guide]` | IHG 等酒店集团会员体系 / 积分订房 / 买分促销、航班里程票、跨境订票支付、酒店航司退改新规（2026-09-21 起新板块，IHG 优先） | `/services/travel` |

近 4 天发过的板块不要再发。选题必须有**当期由头**（新规生效、涨价、发售、政策变更），不写"万年常青"泛论。

**去重**：`ls content/blog/` 全看一遍，同一主题已有成稿就换题，不要写"2026 更新版"。

## 二、事实核实（硬要求）

涉及价格、政策、门槛、日期、型号、发售时间的，**先用 agent-reach 核一手来源**（官网、IRS/FTC 等官方公告、品牌 newsroom）。核不到的具体数字**不要写**，改成定性描述。

- 可以写**第三方产品的官方价**（如 Xbox Game Pass $22.99/月），但必须核实且标注口径时间
- **不要写 YoTrade 自己的服务报价** —— 本站只引流，价格留在 yotradeapi.com 和微信

把用到的来源记下来，PR body 里要列。

## 三、frontmatter

```yaml
---
title: <主标题：核心结论 + 年份 + 关键数字>
description: <2 句。第 1 句给结论，第 2 句给本文覆盖范围。>
image: /images/blog/<slug>-cover.png
date: "YYYY-MM-DD"
published: true
categories: [us-business, guide]
author: 极客杰尼
---
```

`author` 恒为 `极客杰尼`。`slug` 用英文连字符，含年份，如 `1099-k-2026-nra-llc-seller-guide`。

## 四、正文结构

约 **2600 中文字**（成稿 11,000–13,000 字符）。

1. **来源声明 blockquote** —— `> 本文整理自 ...，预计阅读时长 N 分钟。`
2. **开场 2–3 段** —— 从读者真实处境切入（"过去三年你可能被这件事反复折腾过心态"），不要从定义开场
3. `## 谁需要看这篇？` —— 4 条 `- 🎯 ` 开头的人群画像，末尾接 1 段"先看这两篇"的站内链
4. `---`
5. `## 一、`…`## 二、`… —— 中文数字编号，`### 1.1` 二级细分。**每篇至少 2 张 markdown 表格**（阶段对比、门槛对照、方案选型）
6. `## 常见问题 Q&A` 或 `## 自查清单：我现在该做什么`
7. `## YoTrade 相关服务` —— 1 段场景引入 + 3 条 `- 🎯 **加粗标题**：说明`，然后：
   ```
   👉 [咨询 XX 服务](/services/<路由>?utm_source=blog&utm_medium=cta&utm_campaign=<slug>) | [查看 XX 方案](/services/<路由>?utm_source=blog&utm_medium=cta&utm_campaign=<slug>)
   ```
8. `---`
9. `## 相关阅读` —— 2–3 条站内 `/blog/<slug>`
10. `---`
11. **免责斜体** —— `*本文信息基于 2026 年 N 月 ... 整理，... 以官方当期公告为准。本文不构成税务/法律/金融建议。*`

## 五、链接规则

- **站内链必须核实 slug 真实存在**（`ls content/blog/`）—— 写死链是历史上最常见的返工原因
- 每篇 2–4 条站内链，自然嵌在正文里，不要全堆在"相关阅读"
- **跨站外链**：涉及 AI API / 技术侧的，可加 **最多 1 条** 指向姊妹站 `https://blog.yotradeapi.com/blog/<slug>`（PR #141 已放行）

## 六、封面

`public/images/blog/<slug>-cover.png`，**2560×1440 PNG**。仓库里没有生成脚本。
出不了图就**不要瞎填 `image:` 指向不存在的文件** —— 沿用同板块一张既有封面，或留待人工补，并在 PR body 里注明。

## 七、门禁

提交前必须过：

```bash
pnpm typecheck
```

`main` 有 ruleset `Require typecheck on main`（必需状态检查 `typecheck`、strict、无 bypass），所以**只能走 PR 合并，不能直推 main**。

## 八、PR

分支 `blog/daily-YYYYMMDD-<slug>`，标题 `docs(blog): <文章 title>`，body 按历史格式：

```
Daily auto-published post.

板块：<中文板块名>（<categories 第一项>）— <为什么选这个板块，如"覆盖近 4 天未发过此板块，保持多样性">。

Sources:
- <一手来源 1>
- <一手来源 2>

字数：约 N 中文字，含 N 张表格，CTA 均带 UTM 参数指向 `/services/<路由>`。
```

推完分支和 PR 即结束 —— **合并由 `scripts/daily-run.sh` 等 typecheck 绿了之后做**，不要自己 merge。
