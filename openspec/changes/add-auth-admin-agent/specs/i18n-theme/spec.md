# Capability: i18n-theme（国际化与深浅色）

## ADDED Requirements

### Requirement: 路由级国际化
系统 SHALL 以 next-intl 提供 `zh`（默认，无前缀）与 `en`（`/en` 前缀）两种语言，所有页面路由位于 `app/[locale]/`；旧路径 SHALL 308 重定向到对应 locale 路径。

#### Scenario: 默认中文
- **WHEN** 访问 `/`
- **THEN** 以中文渲染，URL 无语言前缀

#### Scenario: 切换语言
- **WHEN** 用户点击语言切换器选择 English
- **THEN** 跳转到 `/en/...`，界面全量英文

### Requirement: 翻译集中管理
所有界面文案 SHALL 集中于 `messages/{zh,en}.json`，键结构按页面/组件命名空间组织，不硬编码双语文案。

#### Scenario: 新增文案
- **WHEN** 新页面需要文案
- **THEN** 在两个语言文件同 namespace 下补键，页面经 `getTranslations`/`useTranslations` 读取

### Requirement: 深浅色模式
系统 SHALL 以 next-themes 提供 light/dark/system 三态主题（class 策略），导航栏提供切换器，默认跟随系统；两套设计令牌同步覆盖全部组件。

#### Scenario: 切换深色
- **WHEN** 用户切换到 dark
- **THEN** 全站背景/文字/卡片即时切换为深色令牌，刷新后保持

### Requirement: Medium 风格设计系统
全站视觉 SHALL 参考 Medium：衬线标题（font-serif）+ 无衬线正文、充足留白、圆角胶囊交互件、克制中性色 + 品牌绿点缀。

#### Scenario: 风格一致性
- **WHEN** 浏览首页/专栏/学习中心
- **THEN** 标题衬线、卡片圆角带边框、按钮胶囊形，视觉风格统一
