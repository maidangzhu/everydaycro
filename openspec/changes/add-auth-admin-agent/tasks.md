# Tasks: add-auth-admin-agent

## Phase 1 — 认证与权限
- [x] 安装 better-auth / next-intl / eve / next-themes，pnpm allowBuilds 配置
- [x] Prisma schema：Better Auth 四表 + Favorite/LearningProgress/UserPoints/PointLedger/DailyCheckIn
- [x] `packages/auth`：角色矩阵 + admin 插件 + `isAdminUser()` 自举
- [x] `/login` `/register` 页 + `authClient` + 登录态导航（UserMenu）

## Phase 2 — i18n + 主题
- [x] 路由迁移 `app/` → `app/[locale]/`，middleware locale 协商 + 旧路径 308
- [x] `messages/{zh,en}.json` 全量翻译；LocaleSwitcher / ThemeToggle
- [x] Medium 风格设计令牌（衬线标题/留白/胶囊件）

## Phase 3 — 积分体系
- [x] `lib/points.ts`：POINT_RULES + `awardPoints()` 幂等发放 + `levelInfo()` 六级
- [x] 签到（DailyCheckIn + streak）、阅读条目、答题、周完成接入发放
- [x] 首页 MemberCard：积分/等级/连续天数展示

## Phase 4 — 用户态上云
- [x] 收藏（资讯/专栏）登录云端同步，匿名 localStorage
- [x] 学习进度（周路径 doneIds）云端合并展示

## Phase 5 — Admin 后台
- [x] `/admin` 布局 + 权限守卫（requireAdmin）
- [x] Dashboard：用户/内容/积分概览
- [x] 用户管理：改角色、封禁/解封
- [x] 内容管理：一键出刊/生成专栏、文章上下架

## Phase 6 — AI 助手（EVE）
- [x] `apps/web/agent/`：agent.ts（OpenRouter 模型）+ instructions.md 人设
- [x] `channels/eve.ts`：Better Auth 会话鉴权 + localDev 兜底
- [x] 8 个工具：get_latest_issue / get_issue_detail / search_issues / list_posts / get_post / search_glossary / get_learning_path / web_search
- [x] `/agent` 页面：登录门控 + useEveAgent 聊天 UI（建议气泡/停止/错误态）
- [x] listPosts/getPostBySlug 过滤未发布（后台下架即时生效）

## Phase 7 — 验证
- [x] `pnpm build` 全绿（含 EVE agent 构建）
- [x] 全路由 200 / 登录门控（/agent 未登录显示引导）/ EVE health ready
- [x] 文档更新（README/openspec）

> 沙箱环境说明：DATABASE_URL 为占位串，依赖数据库的页面（首页/专栏）运行期 500 属预期；构建、路由、Agent 运行时均已验证。附带修复：`@everydaycro/db` 改惰性初始化（EVE 加载 authored 模块不再因缺 env 崩溃）、自定义 OpenRouter 模型需显式 `modelContextWindowTokens`。
