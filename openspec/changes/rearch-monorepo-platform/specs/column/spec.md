# Capability: column（深度专栏 + 本地互动）

## ADDED Requirements

### Requirement: Post 数据模型
系统 SHALL 提供 `Post` 模型（slug 唯一、title、kind、dek、body markdown、tags、issueDate?、publishedAt?）。

#### Scenario: 入库
- **WHEN** 生成一篇专栏
- **THEN** 以唯一 slug 落库，`tags` 默认为空数组

### Requirement: AI 专题生成管线
系统 SHALL 提供 `generateColumnPost()`，基于近期精选 issue 生成专题长文并写入 `Post`。

#### Scenario: 生成
- **WHEN** 触发生成
- **THEN** 产出一篇 markdown 正文、标题、摘要的 Post

### Requirement: 专栏浏览
系统 SHALL 提供 `/column` 列表与 `/column/[slug]` 详情，正文渲染 markdown。

#### Scenario: 阅读
- **WHEN** 访问 `/column/[slug]`
- **THEN** 展示标题、摘要、正文

### Requirement: 本地互动
用户 SHALL 能收藏专栏文章（localStorage，key 前缀 `everydaycro:`）。

#### Scenario: 收藏
- **WHEN** 收藏某文并刷新
- **THEN** 收藏状态保留
