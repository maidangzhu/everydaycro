# Capability: admin（运营后台）

## ADDED Requirements

### Requirement: 后台入口与守卫
系统 SHALL 提供 `/admin` 后台（Dashboard / 用户管理 / 内容管理），所有页面与 Server Action 统一 `requireAdmin()` 校验，非 admin 被拒绝。

#### Scenario: 未登录访问
- **WHEN** 未登录用户访问 `/admin`
- **THEN** 被重定向到登录页

#### Scenario: 普通用户访问
- **WHEN** role=user 用户访问 `/admin`
- **THEN** 显示无权限提示，不暴露任何后台数据

### Requirement: Dashboard 概览
Dashboard SHALL 展示用户数、今日新用户、日报期数、专栏篇数、今日积分发放等核心指标。

#### Scenario: 概览
- **WHEN** admin 打开 `/admin`
- **THEN** 看到上述指标的最新值

### Requirement: 用户管理
admin SHALL 能修改用户角色（user/editor/admin）与封禁/解封；不允许封禁自己。

#### Scenario: 改角色
- **WHEN** admin 把某用户角色改为 editor
- **THEN** 该用户即时获得 editor 权限，列表刷新可见

### Requirement: 内容管理
admin SHALL 能一键触发出刊（`generateCroIssue`）与生成专栏（`generateColumnPost`），并切换文章上下架。

#### Scenario: 生成日报
- **WHEN** admin 点击「生成日报」
- **THEN** 运行内容管线，成功后首页可见新刊（当日已生成则幂等返回缓存）

#### Scenario: 下架文章
- **WHEN** admin 把某专栏文章下架
- **THEN** `/column` 列表、详情页与 Agent 工具均不再返回该文章
