# everydaycro

每天精选海外 CRO（临床合同研究）+ AI 最值得看的 3 条干货。

## 技术栈

Next.js (App Router) + React + Prisma + PostgreSQL (Neon)。
抓取用 Exa 多路搜索，编辑用自封装的 AI SDK 抽象层（默认走 OpenRouter）。

## 跑起来

```bash
pnpm install
# 配置 .env / .env.local（DATABASE_URL、EXA_API_KEY、OPENROUTER_*）
pnpm exec prisma db push   # 同步表结构
pnpm generate              # 抓一期（每天一次，重复跑命中缓存）
pnpm dev                   # http://localhost:3000
```

## 流程

```
Exa 多路搜索 → 去重/事件聚类 → buildCandidates（候选池）
  → curateCroIssue（LLM 选 3 条干货 + 中文编辑）
  → Prisma 入库（CroIssue / CroItem / CroSource）
```

## 结构

```
lib/ai/index.ts   # AI 抽象层：getAiProvider + complete()，默认 OpenRouter
lib/cro/
  exa.ts          # Exa 多路搜索（头版/临床试验/工具/公司/监管）
  issue.ts        # 去重、聚类、候选池
  editor.ts       # LLM 精选 3 条干货并中文改写
  store.ts        # Prisma 读写
  generate.ts     # 编排：抓 → 选 → 存（幂等）
app/
  page.tsx             # 最新一期
  archive/page.tsx     # 归档
  issue/[date]/        # 单期
  api/generate/        # 定时触发（可配 CRON_SECRET）
scripts/generate.ts    # pnpm generate
```

## 每天定时

- 本地/服务器：`pnpm generate` 加进 crontab。
- Vercel：给 `app/api/generate/route.ts` 配 cron，带 `Authorization: Bearer $CRON_SECRET`。
