# everydaycro 项目约定

## 定位
CRO×AI 垂直媒体 + 学习社区。三大支柱：今日精选（资讯）、学习中心（新人成长）、深度专栏（SEO/收藏）。不做完整 UGC 论坛。

## 技术栈
- 包管理：pnpm 11 workspace + Turborepo
- Web：Next.js 15（App Router）+ React 19 + TypeScript 5.8
- UI：shadcn/ui（copy-in，组件源入库）+ Tailwind CSS
- 数据：PostgreSQL + Prisma（`prisma-client-js` + `@prisma/adapter-pg`）
- 内容管线：Exa 召回 → 聚类 → LLM 精选 → Prisma 入库（`@everydaycro/content`）

## Monorepo 结构
- `apps/web` — Next.js 应用（`@everydaycro/web`）
- `packages/ui` — shadcn 组件库（`@everydaycro/ui`）
- `packages/content` — 内容中台：cro 管线 + quiz/glossary（`@everydaycro/content`）
- `packages/db` — Prisma schema + client 单例（`@everydaycro/db`）
- `packages/config` — 共享 tsconfig / tailwind preset / eslint（`@everydaycro/config`）

## 关键约定
- **Prisma client 只在 `packages/db` 生成**，`output` 显式固定；其它包一律 `import { prisma } from '@everydaycro/db'`。
- **用户态数据（学习进度/收藏/打卡）第一版用匿名 localStorage**，命名空间 `everydaycro:*`，不建用户表、不引入登录。
- **内容生成在 `packages/content`**，`apps/web` 只负责渲染与 API 触发。
- 代码注释用中文，密度与现有代码一致。

## 常用命令（根目录，走 turbo）
- `pnpm dev` — 起 apps/web 开发服
- `pnpm build` — 全量构建（依赖 ^build + db:generate）
- `pnpm lint` — 全量 lint
- `pnpm generate` — 跑每日 CRO 内容管线
