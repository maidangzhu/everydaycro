# Tasks: rearch-monorepo-platform

## Phase 0 — 底座
- [x] 落 OpenSpec 四件套（proposal/design/specs×5/tasks）
- [x] 建 `turbo.json` / `pnpm-workspace.yaml` / 根 `package.json`
- [x] 安装 turbo、tailwind、shadcn 依赖

## Phase 1 — Monorepo 迁移
- [x] `packages/db`：迁 prisma + client，prisma-client generator 固定 output，导 `db:generate`
- [x] `packages/content`：迁 lib/cro + quiz + ai，import 指向 `@everydaycro/db`
- [x] `packages/config`：tsconfig.base + tailwind preset
- [x] `apps/web`：迁 app/，引用 workspace 包
- [x] 验证 dev/build/generate 全绿

## Phase 2 — 设计系统
- [x] `packages/ui` shadcn 组件（button/card/badge/progress/input/skeleton/separator）+ tailwind preset 接入 web
- [x] 品牌令牌（品牌绿）+ 深浅色（next-themes）
- [x] layout + 首页重构为 shadcn；移动端底部 Tab 导航

## Phase 3 — 资讯
- [x] `/issue/[date]` 重构；新增 `/issue/[date]/[rank]`
- [x] 名词高亮联动（命中 GLOSSARY → 跳 `/learn/glossary?q=`）
- [x] 资讯收藏（localStorage）

## Phase 4 — 学习中心
- [x] `LEARNING_PATH` 编排数据（content 包，4 周）
- [x] `/learn` + `/learn/path/[week]`，进度条/判分/解析
- [x] 每日一练保留连对/streak；周路径进度存 localStorage

## Phase 5 — 专栏
- [x] `Post` 模型 + db push；`generateColumnPost` 管线
- [x] `/column` + `/column/[slug]`；专栏收藏（localStorage）
- [x] 空态 / 极简 Markdown 渲染 / metadata·SEO

## Phase 6 — 验证
- [x] 端到端验证：`pnpm build` 全绿、`generate` 出刊、`generate:column` 出文、全路由 200、名词联动命中
- [x] 勾选全部完成项
