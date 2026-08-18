# Capability: learning（学习中心）

## ADDED Requirements

### Requirement: 学习路径
系统 SHALL 把 `QUIZ_BANK` 按主题编排为 4 周学习路径（CRO基础与角色 / 试验设计 / 法规合规 / 统计与AI），路径为编排数据、题目仍为单一出处。

#### Scenario: 路径展示
- **WHEN** 访问 `/learn`
- **THEN** 展示 4 周路径及每周完成进度

### Requirement: 周路径闯关
系统 SHALL 提供 `/learn/path/[week]`，逐题作答、判分、显示解析。

#### Scenario: 答题判分
- **WHEN** 用户在某周路径作答
- **THEN** 即时判对错并显示解析，完成后计入该周进度

### Requirement: 学习进度与打卡
学习进度、连对、每日一练 streak SHALL 存于 localStorage（`everydaycro:*`），并在 UI 以进度环/进度条可视化。

#### Scenario: 进度持久化
- **WHEN** 完成题目后刷新
- **THEN** 进度环与 streak 保留

### Requirement: 名词速查
系统 SHALL 保留名词速查（`searchGlossary` 模糊匹配 abbr/full/zh），并支持以查询词定位（供资讯联动）。

#### Scenario: 搜索名词
- **WHEN** 输入缩写/英文/中文
- **THEN** 返回匹配名词卡片
