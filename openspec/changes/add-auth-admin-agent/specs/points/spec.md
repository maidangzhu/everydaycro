# Capability: points（积分体系）

## ADDED Requirements

### Requirement: 积分账本
系统 SHALL 提供 `UserPoints`（balance/totalEarned 冗余）与 `PointLedger`（明细）双表；发放同时写两表。

#### Scenario: 首次发放
- **WHEN** 用户首次获得积分
- **THEN** 创建 UserPoints 行并追加 Ledger 明细，余额等于明细之和

### Requirement: 幂等发放
`awardPoints(userId, reason, refType, refId)` SHALL 以 `(userId, reason, refType, refId)` 唯一约束保证同一事件只发一次，重复调用返回 0。

#### Scenario: 重复触发
- **WHEN** 同一条目被重复计为「已读」并再次调用发放
- **THEN** 第二次不产生新明细，余额不变

### Requirement: 积分规则
系统 SHALL 按规则发放：每日签到 5、阅读资讯条目 2、答对题目 3、完成一周学习路径 20。

#### Scenario: 签到
- **WHEN** 用户当日首次签到
- **THEN** +5 分并记录 streak；当日重复签到不再发分

### Requirement: 等级
系统 SHALL 由 totalEarned 推导 6 级等级（L0 见习 0 / L1 助理 50 / L2 专员 150 / L3 资深 400 / L4 专家 1000 / L5 主编 2500），并给出距下一级所需积分。

#### Scenario: 等级展示
- **WHEN** 用户 totalEarned = 60
- **THEN** 等级 L1，提示距 L2 还需 90 分

### Requirement: 前端展示
首页会员卡 SHALL 展示积分余额、等级、连续签到天数；未登录展示注册引导。

#### Scenario: 会员卡
- **WHEN** 登录用户访问首页
- **THEN** 会员卡显示问候、积分、等级、streak 与签到按钮
