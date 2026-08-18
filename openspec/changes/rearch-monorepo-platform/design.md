# Design: rearch-monorepo-platform

## 架构决策

### D1 包划分
- `apps/web`：唯一部署单元，只做路由、渲染、API 触发。
- `packages/content`：内容与领域逻辑单一出处（cro 管线 + quiz/glossary + 学习路径 + 专栏生成）。未来 cron / newsletter / 只读 API 复用它。
- `packages/db`：Prisma schema + client 单例。**client `output` 显式固定在本包**，其余包只 import，不各自生成。
- `packages/ui`：shadcn copy-in 组件，一处维护多 app 复用。
- `packages/config`：`tsconfig.base.json` + tailwind preset + eslint，各包 extends。

### D2 数据流（内容管线不变，位置迁移）
```
Exa 召回(白名单源+KOL) → 质量过滤 → 聚类 → LLM 精选 → saveCroIssue (Prisma)
   packages/content/cro/*                                  ↓
                                                    packages/db (prisma)
                                                           ↓
                                              apps/web 渲染 /api/generate 触发
```
专栏复用同管线：`generateColumnPost()` 基于近期 issue 生成专题长文入 `Post` 表。

### D3 用户态数据 = 匿名 localStorage
学习进度、答题记录、打卡 streak、收藏（资讯/专栏）全部存浏览器，命名空间 `everydaycro:*`。不建 User/Progress/Card 表。理由：现状无认证体系，零门槛优先，隐私好；换设备丢失是可接受代价。读写通过 `apps/web` 内一个小 hook（`useLocalProgress`）封装，便于未来替换为服务端。

### D4 学习路径 = 题库的视图，不改题库
`QUIZ_BANK` 保持不变。新增 `LEARNING_PATH`（content 包）：按 `category` + 显式题 id 编排为 4 周，每周引用题 id 列表。路径是「编排数据」，题目仍是单一出处。

### D5 名词高亮联动
资讯正文渲染时，用 `GLOSSARY` 的 abbr/zh 做命中替换为可点锚点，点击跳到名词速查（携带 `?q=<term>`）。纯前端处理，不改存储。

## 关键取舍
- **OpenSpec 用等价目录结构手写四件套**，不强依赖 openspec CLI（环境未安装）。结构与校验规则对齐官方，后续可平滑接入 CLI。
- **不引入登录**：互动限于本地收藏/进度/打卡。
- **`Post.tags` 预留**：为搜索/商业化铺路（呼应 search-design.md 后续项），本期不做标签检索 UI。

## Prisma in monorepo 注意点
`generator client` 显式 `output = "../node_modules/.prisma/client"`（或包内 `.generated`），保证单一生成位置；`packages/db` 的 `package.json` 暴露 `db:generate`/`db:migrate` 脚本，turbo `build` 依赖 `db:generate`。
