# Capability: design-system（shadcn UI 与设计令牌）

## ADDED Requirements

### Requirement: shadcn 组件库
`packages/ui` SHALL 以 shadcn copy-in 方式提供组件，至少包含 `button card badge tabs dialog input progress separator skeleton avatar tooltip sheet sonner dropdown-menu`，供 `apps/web` 引用。

#### Scenario: 引用组件
- **WHEN** `apps/web` 中 `import { Card } from '@everydaycro/ui'`
- **THEN** 组件正常渲染且类型可用

### Requirement: 品牌设计令牌
现有 CSS 变量（`--bg #fafaf7`、`--ink`、`--accent #0f5c46` 等）SHALL 映射为 Tailwind/shadcn 设计令牌，保留品牌绿。

#### Scenario: 首页使用令牌
- **WHEN** 渲染首页
- **THEN** 主色、背景、文字色来自设计令牌而非硬编码

### Requirement: 深浅色主题
系统 SHALL 支持深浅色切换（next-themes），配色经 CSS 变量双套实现。

#### Scenario: 主题切换
- **WHEN** 用户切换深色模式
- **THEN** 全站颜色平滑切换且对比度可读

### Requirement: 布局重构
首页与全局布局 SHALL 用 shadcn 组件重构，移动端提供抽屉/底部导航（sheet）。

#### Scenario: 移动端导航
- **WHEN** 在窄视口打开站点
- **THEN** 通过 sheet 提供导航入口
