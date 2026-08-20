# everydaycro

CRO × AI 垂直媒体 + 学习社区：每天精选海外 CRO（临床合同研究）+ AI 干货，附新人学习路径与深度专栏。Medium 风格，支持中英双语、深浅色、账号积分体系与站内 AI 助手。

## 技术栈

- **Monorepo**：pnpm workspace + Turborepo
- **Web**：Next.js 15 (App Router) + React 19 + TypeScript
- **UI**：shadcn/ui（copy-in）+ Tailwind，Medium 风格，深浅色（next-themes）
- **i18n**：next-intl（`zh` 默认无前缀，`en` 带 `/en` 前缀）
- **认证**：Better Auth（邮箱密码 + 角色权限 user/editor/admin）
- **数据**：PostgreSQL (Neon) + Prisma（`prisma-client` generator）
- **检索**：AI Gateway 免费 Exa web search（默认）/ 直调 Exa（回退）
- **编辑**：LLM 精选（默认 OpenRouter）
- **Agent**：Vercel EVE（同域 `/eve/v1/*`，站内工具 + Exa 联网）

## 结构

```
apps/web            Next.js 应用（路由 / 渲染 / API / agent）
apps/web/agent      EVE AI 助手（instructions + channels + tools）
packages/ui         shadcn 组件库（@everydaycro/ui）
packages/content    内容中台：cro 管线 + quiz/glossary + 学习路径 + 专栏生成
packages/db         Prisma schema + client 单例（@everydaycro/db）
packages/auth       Better Auth + 角色/权限矩阵（@everydaycro/auth）
packages/config     共享 tsconfig / tailwind preset
openspec/           OpenSpec 规格（四件套）
```

## 页面

- `/` 首页 Dashboard：今日精选 + 会员卡（积分/等级/签到）+ 学习路径钩子 + 名词速查
- `/archive` 精选日报归档；`/issue/[date]` 单期；`/issue/[date]/[rank]` 单条详情（名词高亮联动）
- `/learn` 学习中心：四周学习路径；`/learn/path/[week]` 闯关；`/learn/glossary` 名词速查
- `/column` 深度专栏；`/column/[slug]` 专栏文章
- `/agent` 站内 AI 助手（登录可用，可查日报/专栏/词条/学习路径，可联网搜索）
- `/login` / `/register` 登录注册
- `/admin` 运营后台（仅 admin）：Dashboard / 用户管理（角色、封禁）/ 内容管理（出刊、专栏生成、上下架）
- 语言切换：任意页面右上角；`/en/...` 为英文版

## 角色与权限

| 角色 | 内容 | 用户管理 | 后台 | AI 助手 |
|------|------|----------|------|---------|
| user | 只读 | - | - | ✓ |
| editor | 读 + 生成 | - | - | ✓ |
| admin | 全量 | 管理 | ✓ | ✓ |

首个超管：把邮箱写入 `ADMIN_USER_IDS` 环境变量即可自举，无需改库。

## 积分体系

签到 +5 / 阅读条目 +2 / 答对 +3 / 完成一周路径 +20；等级 L0 见习 → L5 主编（按累计积分 0/50/150/400/1000/2500）。发放按 `(userId, reason, refType, refId)` 唯一约束幂等。登录用户云端同步收藏与学习进度，匿名走 localStorage。

## 跑起来

```bash
pnpm install
# 配置根目录 .env.local：DATABASE_URL、BETTER_AUTH_SECRET、OPENROUTER_*、EXA_API_KEY（可选）
pnpm --filter @everydaycro/db db:push     # 初始化/同步数据库 schema
pnpm build               # turbo 全量构建（含 prisma generate + EVE agent）
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

## AI 助手（EVE Agent）

`apps/web/agent/`，与 Next 同域部署（`withEve`）：

- `instructions.md` 中文人设「小克」，面向 CRO 从业者
- `channels/eve.ts` 复用 Better Auth 会话 cookie 鉴权，未登录 401
- `tools/` 8 个工具：get_latest_issue / get_issue_detail / search_issues / list_posts / get_post / search_glossary / get_learning_path / web_search（Exa）
- 模型走 OpenRouter，与内容管线共用 `OPENROUTER_*` 环境变量

## 环境变量

- `DATABASE_URL`：Postgres 连接串
- `BETTER_AUTH_SECRET`：认证密钥（必填）
- `ADMIN_USER_IDS`：超管自举名单（逗号分隔邮箱/用户 ID）
- `AI_GATEWAY_EVERYDAY_CRO`：Vercel AI Gateway key（免费 Exa 检索，默认召回源）
- `EXA_API_KEY`：直调 Exa（回退源，`SEARCH_PROVIDER=exa` 强制走它；也供 Agent 联网搜索）
- `OPENROUTER_API_KEY` / `OPENROUTER_BASE_URL` / `OPENROUTER_MODEL`：LLM 编辑与 Agent 对话
- `CRON_SECRET`：保护 `/api/generate`（可选）

## 每天定时

- 本地/服务器：`pnpm generate` 加进 crontab。
- Vercel：给 `app/api/generate/route.ts` 配 cron，带 `Authorization: Bearer $CRON_SECRET`。
