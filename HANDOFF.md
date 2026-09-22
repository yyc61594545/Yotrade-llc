# YoTrade-llc Pass 5 完成状态 — Handoff for Next Session

**生成时间:** 2026-06-04 (本会话末)
**项目根目录:** `/Users/ethan/Projects/Yotrade-llc`
**Prod:** https://www.yotradellc.com

---

## 总体状态 — Pass 5 100% 完成 ✅

**14 个 PR 全部上线**(8 blocks + 4 配套 + 2 cleanup):
- typecheck: 14/14 一次过(Block 7 拦 1 次,1 行 fix-forward)
- auto-merge: 14/14 自动 fire
- Vercel build: 0 failure
- prod size: 304K → 299K(cleanup 后 -5K)
- dead code 清除: -929 行

## 当前 prod 首页结构 (9-section 节奏)

```
1. Hero          (墨夜 + 极光 + cta-breath)
2. ServicesHero  (白 — 3 卡 + 代办横幅)
3. TrustSection  (浅灰 — L6/100%/598/14+省 + 担保 + 3 步)
4. DaifuShowcase (白 — 8 产品 + 「更多 →」)
5. LogoCloud     (浅灰 — marquee 8 品牌)
6. PaymentSection(白 — 6 chip 信任条)
7. WechatBand    (墨夜 — compact 三码)
8. BlogStrip     (白 — 真实最新 3 篇 Fumadocs)
9. Testimonials  (浅灰 — 6 masonry,第 1 墨夜精选)
+ Footer 三码
```

节奏 **墨夜 → 白 → 灰** 交替,无相邻同色。

---

## 业务架构(重要 — 上次纠正后的真实状态)

- 主业:**代购 / 代付 / 代刷** 三件套(走量,但 代付 = 订阅 + 充值 合并)
- 代办 daiban:进阶高客单,横幅式 demote
- 失去闲鱼背书 → 网站重建信任(L6/100%/598/14+省 + 担保 + 3 步流程)
- 整站 **不放价格**(yotradellc 引流,价格留 yotradeapi.com)
- 漏斗:**所有 CTA → 微信成交**(/contact 三码 + 带 UTM)

## 服务页路由(daishua 已合并)

- `/services/daifu` — 海外订阅 + 会员充值(原 daishua 内容并入,6 CATEGORIES)
- `/services/daigou` — 全球海淘
- `/services/daimai` — 限量好物 / 球鞋抽签
- `/services/daiban` — 美国金融基建(代办 4 档,$59–$1599)
- `/services/daishua` → 301 → `/services/daifu`(next.config.ts redirect)

---

## CI 工程化 — Branch Protection + Auto-merge

- **Repo public** (yyc61594545/Yotrade-llc)
- **Ruleset 17230291** (active, enforce_admins=true)
  - 要求 status check `typecheck` pass 才能 merge
  - 禁止 force push / delete on main
- **`allow_auto_merge: true`** — `gh pr merge --auto --squash --delete-branch` 工作正常
- **`.github/workflows/typecheck.yml`** — 每个 PR 跑 `pnpm install + tsc --noEmit`,~2-4 min
  - 关键技巧:CI 里 `cat > next-env.d.ts <<EOF ... EOF` inline 生成(Next.js 标准 reference 两行)
- **`package.json`** + `"typecheck": "tsc --noEmit"`

## globals.css token 全清单

```css
brand-50 #eef4ff / 100 #dbe6fe / 200 #bdd0fd / 300 #93b3fc
        / 500 #3b6ff6 / 600 #2563eb / 700 #1d4ed8 / 900 #16308a
ink-700 / 800 / 900       (墨夜)
wx-500 / 600 / 700        (微信绿)
bg-soft / border-soft     (浅灰)
```

## 已落地 keyframes(globals.css)

- `wx-qr-glow` (8s conic 旋转) / `wx-qr-float` (4.5s Y 浮动)
- `cta-breath` (3.6s 呼吸光晕)
- `pricing-popular-float` (2.8s Y 浮动) / `pricing-badge-glow`
- `brandMarquee` (28s linear) + `.marquee-mask` 两端淡出
- 所有 keyframes 都有 `prefers-reduced-motion` 降级

---

## WechatContact 视觉契约(全站统一三码)

| variant | 用在 | 形态 |
|---|---|---|
| `primary` | `/contact` | 150px QR × 3 + perks |
| `compact` | 4 服务页底部 + WechatBand | 120px QR × 3 + perks |
| `inline` | Footer | 64px QR × 3,无文案 |

全 Server Component,不含 client-side state / copy button。

---

## 两个未完成的 user follow-up

### 1. Testimonials 真实化(高优,易做)
- 当前 `messages/zh.json` 中 `HomePage.testimonials.items.r1~r6` 是 Claude Design 示意占位
- User 需提供闲鱼真实好评 6 条(截图或文字)
- 替换 `r1~r6.{name,meta,quote}` 即可
- Trigger: 用户发闲鱼好评截图

### 2. Pass 4 服务页升级
- 起点 = `/services/daifu`(合并后流量最大)
- Trigger: 用户说 "启动 Pass 4 daifu"
- 行动:
  1. 烘焙 `/tmp/yotrade-daifu-handoff.md`(daifu/page.tsx 全文 + Container + WechatContact 现状)
  2. 给 Claude Design 用户传:他出四段式重排版(Hero / 谁需要 / 服务内容 / 流程 timeline / WechatContact compact)
  3. 集成 → ruleset → auto-merge → verify
  4. Propagate 到 daigou / daimai / daiban(daiban 保留 PricingTable section)

---

## Pass 历史(已上线)

| Pass | 内容 | Status |
|---|---|---|
| 1 | Hero v1 墨夜 + 极光 + brand-blue token | ✅ on prod |
| 2 | /contact + Hero CTA 加重 | ⏭ override by 2.6 |
| 2.5 / 2.5b | Contact 极简化 + rebalance | ⏭ override by 2.6 |
| **2.6** | /contact 三码并排终版 (Claude Design 设计) | ✅ on prod |
| 3 | PricingTable 墨夜深色推荐档 (popular 驱动) | ✅ on prod |
| 5 | 首页 9-section 重排 (本次会话核心) | ✅ on prod |
| 4 | 服务页升级 | 📋 pending (等用户启动) |
| 6 | Blog 列表/详情升级 | 📋 pending |

---

## 关键文件位置

- 首页: `src/app/[locale]/(marketing)/(home)/page.tsx`
- 9 个 home blocks: `src/components/blocks/{hero,services-hero,trust,daifu-showcase,logo-cloud,payment,wechat-band,blog-strip,testimonials}/`
- 4 服务页: `src/app/[locale]/(marketing)/services/{daifu,daigou,daimai,daiban}/page.tsx`
- Contact: `src/app/[locale]/(marketing)/(pages)/contact/page.tsx`
- WechatContact 真相源: `src/components/wechat/wechat-contact.tsx`
- Footer: `src/components/layout/footer.tsx`
- i18n: `messages/{zh,en}.json` (next-intl 用 en.json 作 typed-keys schema)
- globals: `src/styles/globals.css`
- next config (redirects): `next.config.ts`
- fumadocs source: `src/lib/source.ts` (用 `blogSource`,不是 `source`)

## 旧 handoff 文件(给 Claude Design 用)

- `/tmp/yotrade-home-handoff.md` — Pass 5 home(已完成)
- `/tmp/yotrade-services-handoff.md` — Pass 4 服务页(尚未启动,但 daishua 内容已被合并,handoff 内容部分过时,需重做)
- `/tmp/yotrade-pricing-handoff.md` — Pass 3 pricing(已完成)

下次 Pass 4 启动时,**烘焙新的** daifu handoff,**不要复用** services-handoff.md (它基于已合并的 daishua,过时)。

---

## 协作流程 (本次会话验证 work 的模式)

1. User 转 Claude Design 设计稿 (整文件 + i18n 段)
2. 我审 + 修任何路径/类型问题
3. 一气呵成:branch + Write 文件 + commit + push + auto-merge + Vercel verify
4. typecheck/ruleset 拦失败时 fix-forward(同 branch 加 commit)
5. 用 background task 等 cascade,task 完成通知再贴 verify
6. 通过后告知 user + 发反馈让 user 转回 Claude Design

## 下次新会话立即可做

- 等 user 启动 Pass 4 → 立即 `Read` daifu/page.tsx + 共用 components + Write `/tmp/yotrade-daifu-handoff.md`
- 等 user 发闲鱼好评 6 条 → 立即 Python 改 `messages/{zh,en}.json` HomePage.testimonials.items.r1~r6 + PR + cascade

---

**本次会话结尾两条**:
- 上一条:Cleanup C 上线完美(`37dde89`),8 section IDs 全 hit,size -5K
- 这条:写 HANDOFF.md 收尾

下次启动时 Read 本文件即可恢复完整上下文。
