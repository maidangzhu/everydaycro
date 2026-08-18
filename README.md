# everydaycro

CRO × AI 垂直媒体 + 学习社区：每天精选海外 CRO（临床合同研究）+ AI 干货，附新人学习路径与深度专栏。

## 技术栈

- **Monorepo**：pnpm workspace + Turborepo
- **Web**：Next.js 15 (App Router) + React 19 + TypeScript
- **UI**：shadcn/ui（copy-in）+ Tailwind，深浅色（next-themes）
- **数据**：PostgreSQL (Neon) + Prisma（`prisma-client` generator）
- **检索**：AI Gateway 免费 Exa web search（默认）/ 直调 Exa（回退）
- **编辑**：LLM 精选（默认 OpenRouter）

## 结构

```
apps/web            Next.js 应用（路由 / 渲染 / API）
packages/ui         shadcn 组件库（@everydaycro/ui）
packages/content    内容中台：cro 管线 + quiz/glossary + 学习路径 + 专栏生成
packages/db         Prisma schema + client 单例（@everydaycro/db）
packages/config     共享 tsconfig / tailwind preset
openspec/           OpenSpec 规格（四件套）
```

## 页面

- `/` 首页 Dashboard：今日精选 + 学习路径钩子 + 名词速查
- `/archive` 精选日报归档；`/issue/[date]` 单期；`/issue/[date]/[rank]` 单条详情（名词高亮联动）
- `/learn` 学习中心：四周学习路径；`/learn/path/[week]` 闯关；`/learn/glossary` 名词速查
- `/column` 深度专栏；`/column/[slug]` 专栏文章

## 跑起来

```bash
pnpm install
# 配置根目录 .env.local：DATABASE_URL、AI_GATEWAY_EVERYDAY_CRO（或 EXA_API_KEY）、OPENROUTER_*
pnpm build               # turbo 全量构建（含 prisma generate）
pnpm generate            # 抓一期每日精选（每天一次，幂等）
pnpm generate:column     # 基于近期精选生成一篇专栏
pnpm --filter @everydaycro/web dev   # http://localhost:3000
```

## 内容管线

```
Exa 召回（gateway 免费 / 直调回退，多路：头版/试验/工具/公司/监管）
  → buildCandidates 去重/聚类 → curateCroIssue LLM 精选 3 条中文干货
  → Prisma 入库（CroIssue / CroItem / CroSource）
专栏：generateColumnPost 基于近期精选生成专题长文入 Post 表
```

## 环境变量

- `DATABASE_URL`：Postgres 连接串
- `AI_GATEWAY_EVERYDAY_CRO`：Vercel AI Gateway key（免费 Exa 检索，默认召回源）
- `EXA_API_KEY`：直调 Exa（回退源，`SEARCH_PROVIDER=exa` 强制走它）
- `OPENROUTER_API_KEY` / `OPENROUTER_BASE_URL` / `OPENROUTER_MODEL`：LLM 编辑
- `CRON_SECRET`：保护 `/api/generate`（可选）

## 每天定时

- 本地/服务器：`pnpm generate` 加进 crontab。
- Vercel：给 `app/api/generate/route.ts` 配 cron，带 `Authorization: Bearer $CRON_SECRET`。
