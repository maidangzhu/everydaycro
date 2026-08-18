# Capability: monorepo（工程底座）

## ADDED Requirements

### Requirement: pnpm workspace + Turborepo 结构
仓库 SHALL 以 pnpm workspace + Turborepo 组织，包含 `apps/web` 与 `packages/{ui,content,db,config}`，包名以 `@everydaycro/` 为前缀。

#### Scenario: 依赖安装与构建
- **WHEN** 在根目录执行 `pnpm install && pnpm build`
- **THEN** 所有 workspace 包按拓扑顺序构建成功，无类型错误

#### Scenario: 开发服务器
- **WHEN** 执行 `pnpm dev`
- **THEN** `apps/web` 启动 Next.js 开发服，可访问首页

### Requirement: 领域逻辑归属 content 包
CRO 内容管线（exa/issue/editor/generate/store/sources/types）与题库/名词表（quiz.ts）SHALL 位于 `packages/content`，`apps/web` 通过 `@everydaycro/content` 引用。

#### Scenario: 内容管线可独立调用
- **WHEN** 执行 `pnpm generate`
- **THEN** `generateCroIssue()` 运行并写入数据库（或按日期缓存跳过）

### Requirement: Prisma client 单一生成位置
Prisma client SHALL 仅在 `packages/db` 生成（显式 `output`），其它包一律 `import { prisma } from '@everydaycro/db'`。

#### Scenario: 无多实例
- **WHEN** `packages/content` 或 `apps/web` 访问数据库
- **THEN** 使用来自 `@everydaycro/db` 的同一 client 单例

### Requirement: 共享配置
TypeScript / Tailwind / ESLint 配置 SHALL 集中于 `packages/config` 并被各包 extends。

#### Scenario: tsconfig 继承
- **WHEN** 任一包声明 `extends: "@everydaycro/config/tsconfig.base.json"`
- **THEN** 该包通过类型检查
