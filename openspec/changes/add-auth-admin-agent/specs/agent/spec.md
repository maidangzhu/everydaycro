# Capability: agent（站内 AI 助手）

## ADDED Requirements

### Requirement: 同域部署
Agent SHALL 以 Vercel EVE 框架实现在 `apps/web/agent/`，经 `withEve` 与 Next.js 同域部署于 `/eve/v1/*`，无需 CORS 配置。

#### Scenario: 一体构建
- **WHEN** 执行 `next build`
- **THEN** Next 应用与 EVE agent 一同构建并可同时启动

### Requirement: 会话鉴权
Agent 频道 SHALL 复用主站 Better Auth 会话 cookie 鉴权（principalId=用户 ID），localDev 仅限本地开发；生产未登录请求得到 401。

#### Scenario: 未登录调用
- **WHEN** 未登录浏览器访问 `/agent` 页面
- **THEN** 页面显示登录引导；直接请求 eve 路由返回 401

### Requirement: 模型配置
Agent SHALL 经 OpenRouter（OpenAI 兼容协议）调用模型，复用 `OPENROUTER_API_KEY` / `OPENROUTER_MODEL` 环境变量，默认 `z-ai/glm-5.2`。

#### Scenario: 模型路由
- **WHEN** 设置 `OPENROUTER_MODEL` 为其他模型
- **THEN** Agent 对话使用该模型

### Requirement: 站内工具
Agent SHALL 提供工具：get_latest_issue、get_issue_detail（按日期）、search_issues（关键词）、list_posts、get_post（按 slug）、search_glossary、get_learning_path、web_search（Exa，未配置密钥时返回降级提示）；文件名即工具名，输出 JSON 可序列化。

#### Scenario: 查最新日报
- **WHEN** 用户问「最近一期日报讲了什么」
- **THEN** Agent 调用 get_latest_issue 并基于真实数据回答

#### Scenario: 词条一致
- **WHEN** 用户问某行业名词
- **THEN** Agent 优先用 search_glossary，答案与站内词条一致

### Requirement: 人设
Agent SHALL 以中文人设「小克」运行：先结论后依据、列表 ≤6 条、不编造站内内容、查不到如实说明。

#### Scenario: 无结果
- **WHEN** 工具未查到相关内容
- **THEN** Agent 明确说明未查到，不编造日报/文章内容

### Requirement: 聊天界面
`/agent` 页面 SHALL 提供聊天 UI（消息气泡、建议问题、思考中状态、停止/重试、错误提示），并要求登录后使用。

#### Scenario: 对话
- **WHEN** 登录用户发送问题
- **THEN** 流式返回回答；进行中可点击「停止」取消当前轮
