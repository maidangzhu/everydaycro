# everydaycro 搜索设计

记录"内容召回"这条线的设计决策。目标：把"5 条泛 query 碰运气"升级为"白名单源 + 定向检索 + 质量过滤 + 大佬观点"。

## 现状

```
5 条手写 query 并行打 Exa(news 分类,近 7 天)
  → 按 URL 去重 → 标题相似度聚类成事件 → 来源权重排序
  → 取前 12 个候选喂 LLM → LLM 精选 3 条
```

- 抓取:`lib/cro/exa.ts`,5 条固定英文 query(lead/trial/tooling/company/policy)。
- 打分:`lib/cro/issue.ts` 的 `sourceQuality()`,域名分级(FDA/期刊=100,行业媒体=80,X=60,其他=40)。

### 现状的问题

1. **召回窄且不可控**:全靠 Exa 对 5 段自然语言的理解,高质量源头(官方、行业媒体)能否被抓到不确定。
2. **`category:'news'` 把官方源挡在门外**:FDA/EMA 指南、ClinicalTrials.gov 更新不是"news",会被滤掉,政策线最吃亏。
3. **没有质量门槛**:`sourceQuality` 只用来排序,低质源照样进候选池,浪费 LLM 注意力。
4. **缺一类内容**:行业 KOL(如 Formation Bio 的 Benjamine Liu)在 X 上的观点,是新闻之外的高价值情报。

## 设计原则

- **白名单优于黑名单**:垃圾源永远列不完,白名单让"质量"成为默认状态。代价是可能漏新源 → 名单要能随手加。
- **官方源管政策硬数据,行业媒体管可读性和商业动态**,两条线分开喂。
- **KOL 名单是编辑资产**:"认可的 CRO+AI 大佬"名单本身就是差异化,不是算法能替代的。
- **voice 允许为空**:大佬不是天天发干货,宁可那天少一条,也不硬凑水推。

## 架构

两条独立召回线,合并后统一过滤、聚类、精选:

```
┌─ 新闻线 ──────────────────────────────┐
│  白名单源(带权重)→ Exa 定向检索        │   ┐
│  (includeDomains 限定域名)            │   │
└────────────────────────────────────────┘   ├→ 质量过滤 → 聚类 → LLM 精选 3 条
┌─ 大佬线 (voice) ───────────────────────┐   │
│  KOL handle 名单 → Exa tweet 检索       │   │
│  (category:'tweet', livecrawl)         │   ┘
└────────────────────────────────────────┘
```

### 1. 源注册表 `lib/cro/sources.ts`(新增)

把所有"你的判断"集中到一个文件:哪些源可信、哪些大佬值得跟。这份名单同时供三处用——Exa 检索参数、质量打分、将来的 API 过滤参数。

```ts
export const SOURCES = {
  // 官方:政策、硬数据,不走 news 分类,直接检索官网
  official: ['fda.gov', 'ema.europa.eu', 'ich.org', 'clinicaltrials.gov'],
  // 行业媒体:可读性、商业动态,走 news 分类
  media: ['endpts.com', 'statnews.com', 'fiercebiotech.com',
          'clinicaltrialsarena.com', 'outsourcing-pharma.com', 'biopharmadive.com'],
}

export const KOLS = ['BenjamineYLiu']   // Formation Bio;后续手动扩充,宁缺毋滥

// 域名分级查表函数(从 issue.ts 挪来,单一出处)
export function sourceQuality(url: string): number
```

分级规则:`official=100`,`media=80`,`x.com/twitter.com=60`,其他 `=40`。

### 2. 召回 `lib/cro/exa.ts`

每条路线绑定自己的源和分类:

| 路线 | includeDomains | category | 说明 |
|---|---|---|---|
| policy | `SOURCES.official` | ❌ 不带 | 直接检索官网,不被 news 滤掉(关键修复) |
| lead / trial / tooling / company | `SOURCES.media` | `news` | 行业媒体报道 |
| voice | —(handle 进 query) | `tweet` | 大佬观点,`livecrawl:'preferred'` |

- 新闻线每路 `limit` 从 5-7 提到 **8**。
- voice 线单独函数 `searchKolVoicesWithExa()`:遍历 `KOLS`,每个 handle 一次调用(`query: 'from:@handle AI clinical trial'`,近 7 天,`livecrawl:'preferred'`),结果 `searchRoute` 标为 `'voice'`。
- 主入口 `searchCroNewsRoutesWithExa()` 并发新闻线 + voice 线,合并返回。

### 3. 过滤 + 聚类 `lib/cro/issue.ts`

- **质量硬过滤**(新增):召回后 `sourceQuality(url) >= 60` 才进候选池,低质源直接扔。
- 聚类、事件合并逻辑**不动**。
- 删掉本地 `sourceQuality()`,改从 `sources.ts` 导入。

### 4. 精选 `lib/cro/editor.ts`

- `section` 枚举加 `'voice'`。
- prompt **暂不区分** news/voice:LLM 从来源域名(x.com)能自行判断是推文,先不加复杂度。

### 5. 类型与前端

- `lib/cro/types.ts`:`CroSearchRoute`、`CroSection` 各加 `'voice'`。
- `app/IssueView.tsx`:label 加 `voice: '大佬观点'`。

## 有意的简化(暂不做的)

- **不加 `ResultKind` / `authorHandle` 字段**:voice 靠 `searchRoute==='voice'` 识别,够用。
- **聚类不分线**:先用现有逻辑,出问题再说。
- **不把"载体"和"栏目"拆成两个字段**:现在 voice 即栏目("大佬观点"),将来要做交叉筛选(如"按 policy 看所有内容含大佬推文")时再拆。
- **不改 LLM 区分逻辑**。

这些是需要时的后续项,现在每一行都要有明确产出。

## 改动清单

```
新增  lib/cro/sources.ts   ~30 行   名单 + sourceQuality
改    lib/cro/exa.ts       ~30 行   路线加 includeDomains + voice 函数
改    lib/cro/issue.ts     ~15 行   加硬过滤,删本地 sourceQuality
改    lib/cro/types.ts     2 行     section/route 加 'voice'
改    app/IssueView.tsx    1 行     label 加"大佬观点"
```

约 80 行增量,不动存储 schema、不动架构、无新依赖、无数据库迁移。

## 待定 / 决策记录

- **voice 线每个 handle 单独调一次 Exa**(初期 handle 少,准优先;名单变长后再考虑合并批处理)。
- **KOL 名单内容必须人来填**,这是编辑判断,不是算法。
- 存储 schema 不需要改(Item.section 本来就是字符串)。

## 后续项(不在本期)

- tags/entities 入库(搜索 + 商业化共用)。
- 跨天事件去重("同一事件的进展"识别),依赖 tags/entities。
- newsletter / 只读 API。
