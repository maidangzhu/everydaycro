# Design: add-auth-admin-agent

## 架构决策

### D1 认证选型：Better Auth（自托管）
不用 Clerk/Auth.js：Clerk 引入外部服务与费用；Auth.js 角色管理需自建。Better Auth + Prisma 适配器开箱支持 email/password + admin 插件（角色/封禁/权限矩阵），数据全在自己库里。会话开 5 分钟 cookie 缓存，导航栏读登录态不打库。

### D2 权限：声明式角色矩阵，单一出处
```
statement = { content:[read,create,update,delete], user:[read,manage], admin:[access], agent:[use] }
user:   content:read                agent:use
editor: content:read,create,update agent:use
admin:  content:*  user:*  admin:access  agent:use
```
矩阵只写在 `packages/auth`（`createAccessControl`），页面级用 `isAdminUser()`（admin 角色 ∪ `ADMIN_USER_IDS` 自举名单），为将来「后台可配置角色」留单一事实源。

### D3 用户态：双轨（匿名 localStorage ↔ 登录云端）
登录态读云端（Favorite/LearningProgress 表），未登录回落 localStorage（`everydaycro:*` 命名空间保留）。收藏/进度写入统一走 `lib/favorites.ts`、`lib/actions.ts` 的 Server Action，客户端 hook 按登录态分流，页面刷新即合并展示。

### D4 积分：余额冗余 + 明细幂等
- `UserPoints`（balance/totalEarned）冗余存储，读路径零聚合。
- `PointLedger` 带 `(userId, reason, refType, refId)` 唯一约束；`awardPoints()` 靠唯一冲突幂等，重复触发不发分。
- 等级由 `totalEarned` 推导（0/50/150/400/1000/2500 → L0-L5），`levelInfo()` 纯函数双端复用（`points.client.ts` 无 DB 依赖）。

### D5 Admin：Server Action 直连，不建 BFF
后台页面全部 Server Component（数据服务端取），操作走 `'use server'` actions，入口统一 `requireAdmin()`（抛 forbidden）。不引入独立 admin API 层，减少一层转发。

### D6 Agent：EVE 同域部署 + 会话级鉴权
- `withEve(nextConfig)` 把 `apps/web/agent/` 挂到 `/eve/v1/*`，与 Next 一体构建，无 CORS。
- `agent/channels/eve.ts` 鉴权链：Better Auth 会话 cookie（`auth.api.getSession`）→ `localDev()` 兜底；生产未登录 401（fail-closed）。
- 模型走 OpenRouter（`@ai-sdk/openai` 兼容协议），与内容管线共用 `OPENROUTER_API_KEY/MODEL`。
- 8 个工具全部只读站内数据（或 Exa 搜索），文件名即工具名；instructions.md 定义中文人设「小克」。

### D7 i18n：路由前缀 + 翻译文件
next-intl：`zh` 为默认 locale（无前缀），`en` 带 `/en` 前缀；翻译集中在 `messages/{zh,en}.json`；middleware 只做 locale 协商与旧路径重定向。主题用 next-themes（class 策略，三态 light/dark/system），令牌已有 `.dark` 变体。

### D8 Medium 风格
衬线标题（font-serif）+ 无衬线正文、大量留白、圆角胶囊交互件、克制的中性色 + 品牌绿点缀；深浅色两套令牌同步维护。

## 关键取舍
- **不做邮箱验证/找回密码**：垂直站内测优先，Better Auth 后续可开。
- **Agent 不做流式 UI 里的工具过程渲染**：只渲染文本部分 + thinking 态，工具调用对用户透明。
- **积分不扣减**：只有正向发放（阅读/答题/签到），避免负余额边界；未来兑换再引入 `amount < 0`。
- **旧路由 308 跳转而非 404**：保留外链 SEO。

## 环境变量
`DATABASE_URL`、`BETTER_AUTH_SECRET`（必填）；`ADMIN_USER_IDS`（超管自举，逗号分隔邮箱/ID）；`OPENROUTER_API_KEY/OPENROUTER_MODEL`（Agent 模型）；`EXA_API_KEY`（Agent 联网搜索，可选）。
