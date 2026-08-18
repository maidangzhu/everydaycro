# Capability: news（精选资讯）

## ADDED Requirements

### Requirement: 单条资讯详情
系统 SHALL 提供路由 `/issue/[date]/[rank]` 展示单条资讯：标题、AI 摘要、detail、takeaway、来源链接列表。

#### Scenario: 打开详情
- **WHEN** 访问某期某条目的详情路由
- **THEN** 展示该条目的摘要、detail、takeaway 与来源，来源可跳转原文

### Requirement: 名词高亮联动
资讯正文渲染时 SHALL 命中 `GLOSSARY` 名词并渲染为可点锚点，点击跳转名词速查（携带查询词）。

#### Scenario: 名词跳转
- **WHEN** 详情正文含「CRO」等名词并被点击
- **THEN** 跳转至名词速查并定位该名词

### Requirement: 本地收藏与分享
用户 SHALL 能将资讯条目收藏（localStorage，key 前缀 `everydaycro:`）并复制分享链接。

#### Scenario: 收藏持久化
- **WHEN** 收藏某条并刷新页面
- **THEN** 收藏状态保留

### Requirement: 期详情重构
既有 `/issue/[date]` 与 `/archive` SHALL 用 shadcn 组件重构，保持数据不变。

#### Scenario: 归档可浏览
- **WHEN** 访问 `/archive`
- **THEN** 列出各期，可进入对应 `/issue/[date]`
