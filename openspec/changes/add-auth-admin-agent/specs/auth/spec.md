# Capability: auth（认证与角色权限）

## ADDED Requirements

### Requirement: 邮箱密码认证
系统 SHALL 提供邮箱密码注册/登录/登出（Better Auth + Prisma 适配器），密码最短 8 位，会话 cookie 带 5 分钟缓存。

#### Scenario: 注册登录
- **WHEN** 用户以有效邮箱密码注册并登录
- **THEN** 创建 User（默认角色 `user`）与 Session，导航栏显示用户菜单

#### Scenario: 重复注册
- **WHEN** 已注册邮箱再次注册
- **THEN** 返回错误，不创建新用户

### Requirement: 角色三档
用户 SHALL 具有角色 `user` / `editor` / `admin` 之一，默认 `user`。

#### Scenario: 新用户
- **WHEN** 新用户注册
- **THEN** `role = "user"`

### Requirement: 声明式权限矩阵
系统 SHALL 以 `createAccessControl` 声明 content/user/admin/agent 四类权限，user 只读内容，editor 可增改内容，admin 全量 + 后台访问；矩阵唯一出处为 `packages/auth`。

#### Scenario: 越权访问后台
- **WHEN** 非 admin 用户访问 `/admin/*` 或调用后台 Server Action
- **THEN** 拒绝（forbidden / 重定向），操作不生效

### Requirement: 超管自举
系统 SHALL 支持 `ADMIN_USER_IDS` 环境变量（逗号分隔邮箱或用户 ID），命中者视为 admin，无需手动改库。

#### Scenario: 首个超管
- **WHEN** 用户邮箱在 `ADMIN_USER_IDS` 中
- **THEN** 该用户拥有 admin 权限并可访问后台

### Requirement: 封禁
admin SHALL 能封禁/解封用户（记 banCount，禁止封自己），被封用户无法登录。

#### Scenario: 封禁
- **WHEN** admin 封禁某用户
- **THEN** 该用户会话失效且无法再登录，直至解封
