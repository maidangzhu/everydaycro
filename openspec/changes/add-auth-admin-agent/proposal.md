# Proposal: add-auth-admin-agent

## 为什么
站点现有互动（收藏/进度/打卡）均为匿名 localStorage，无法跨设备；内容运营（出刊/专栏/下架）依赖命令行脚本；缺少站内智能问答入口。要升级为「有账号体系的垂直媒体 + 学习社区」，需要：认证与角色权限、积分成长体系、运营后台、AI 站内助手，并同步完成国际化（i18n）与深浅色模式，整体视觉参考 Medium。

## 做什么
1. **认证与角色**：Better Auth（Prisma 适配器）实现邮箱密码注册/登录；角色三档 `user/editor/admin`，声明式权限矩阵（content/user/admin/agent 四类 statement）；首个超管经 `ADMIN_USER_IDS` 环境变量自举。
2. **用户态上云**：收藏（资讯/专栏）、学习进度（周路径 doneIds）、每日签到从 localStorage 升级为登录后云端同步（匿名仍走本地）。
3. **积分体系**：`UserPoints`（余额冗余）+ `PointLedger`（明细，唯一约束保证幂等）；规则化发放（签到 5 / 阅读条目 2 / 答对 3 / 完成一周 20）；6 级等级（L0 见习 → L5 主编）。
4. **运营后台**：`/admin`（Dashboard 概览、用户管理：改角色/封禁、内容管理：一键出刊/生成专栏/上下架），全部操作走 Server Action + `requireAdmin()` 校验。
5. **AI 助手**：Vercel EVE 框架，agent 与 Next 同域部署（`withEve`）；8 个站内工具（日报×3、专栏×2、词条、学习路径、Exa 联网）；频道鉴权复用 Better Auth 会话，未登录 401。
6. **i18n + 主题**：next-intl 路由前缀（`zh` 默认、`en` 显式前缀）；next-themes 深浅色三态切换；Medium 风格设计系统（衬线标题、留白、圆角胶囊按钮）。

## 影响面
- 路由整体迁移 `app/` → `app/[locale]/`，旧路径 308 重定向。
- 新增依赖：better-auth、next-intl、eve、@ai-sdk/openai、ai、next-themes。
- Prisma schema 新增 8 张表（User/Session/Account/Verification/Favorite/LearningProgress/UserPoints/PointLedger/DailyCheckIn）。
- `packages/auth` 新包（认证 + 权限单一出处）。

## 风险
- EVE 与 Next 一体构建的构建时长增加 → withEve 生成独立 Vercel service，本地 `next build` 串行构建可接受。
- OpenRouter/Exa 密钥缺失 → Agent 工具返回友好降级信息，不阻塞构建。
- 角色越权 → 所有敏感 Server Action 统一 `requireAdmin()`，Agent 频道 fail-closed。

## 非目标（Out of scope）
OAuth 第三方登录、邮箱验证流程、积分商城/兑换、支付、完整 CMS 编辑器（内容仍由 AI 管线生成 + 人工上下架）。
