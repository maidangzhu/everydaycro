# Proposal: rearch-monorepo-platform

## 为什么
everydaycro 现为单包 Next.js 应用，首页平铺三个板块（精选/速查/每日一练），无独立路由、无学习路径、无深度内容、UI 为手写 CSS。要支撑「CRO×AI 垂直媒体 + 学习社区」三大支柱，需先把工程底座重构为可复用、可扩展的 monorepo，再叠加资讯详情、学习中心、专栏与轻互动。

## 做什么
1. **工程底座**：迁移为 pnpm workspace + Turborepo monorepo，拆出 `apps/web` 与 `packages/{ui,content,db,config}`。
2. **设计系统**：引入 shadcn/ui + Tailwind，建立品牌设计令牌与深浅色，重构首页与布局。
3. **资讯**：新增单条资讯详情路由、正文名词高亮联动、本地收藏/分享。
4. **学习中心**：把题库按 category 编成 4 周学习路径，加进度环/连对/打卡 streak（localStorage）。
5. **专栏**：新增 `Post` 模型与 AI 专题生成管线，提供专栏列表/详情与收藏。

## 影响面
- 目录结构整体迁移（`app/`→`apps/web/app`，`lib/`→`packages/content|db`）。
- Prisma client 生成位置固定到 `packages/db`。
- 新增 `Post` 表（一次 migration）。
- 新增依赖：turbo、tailwindcss、shadcn 相关（class-variance-authority/clsx/tailwind-merge/lucide-react）、next-themes。

## 风险
- Prisma 多包实例/类型不一致 → 通过显式 `output` + 单一 `@everydaycro/db` 出口规避。
- 迁移期 import 残留 → `tsc --noEmit` + `pnpm build` 兜底。
- 范围大 → 按 Phase 推进，每 Phase 独立可验证。

## 非目标（Out of scope）
完整 UGC 论坛、登录/账号体系、服务端进度同步、跨设备收藏。
