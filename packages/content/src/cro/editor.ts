import { z } from 'zod'
import { complete } from '../ai/index'
import type { CroCandidate } from './issue'
import type { CroIssueDraft, CroItemDraft } from './types'

const pickedSchema = z.object({
  picks: z.array(
    z.object({
      index: z.number().int().nonnegative(),
      title: z.string().min(2).max(120),
      summary: z.string().min(8).max(200),
      detail: z.string().min(20).max(600),
      takeaway: z.string().min(8).max(200),
    }),
  ).length(3),
}).strict()

export async function curateCroIssue({
  candidates,
  issueDate,
  issueNumber,
  env = process.env,
}: {
  candidates: CroCandidate[]
  issueDate: string
  issueNumber: number
  env?: NodeJS.ProcessEnv
}): Promise<CroIssueDraft> {
  if (candidates.length === 0) {
    throw new Error('no candidates to curate')
  }

  const pool = candidates.slice(0, 12)
  const input = pool.map((candidate, index) => ({
    index,
    section: candidate.section,
    title: candidate.title,
    excerpt: candidate.excerpt,
    source: candidate.sources[0]?.publisher ?? '',
  }))

  const prompt = [
    '你是临床研究（CRO）与 AI 交叉领域的资深编辑。下面是从海外医药网站和公开来源抓到的候选新闻。',
    '读者是做临床运营的从业者，只要**干货**，不要营销稿、不要空洞的公司宣传。',
    '从这些候选里**精选最有信息量的 3 条**。优先：具体的临床试验应用、可量化的效果（时间/成本/招募提升）、新的监管规则、真实可用的工具。',
    '降权：纯融资/PR、没有实质内容的"AI 将改变一切"类文章、重复的模型发布。',
    '对选中的每条，用自然、准确、克制的简体中文写：',
    '- title：像中文报纸标题，简洁，别带媒体名。',
    '- summary：一句话说清发生了什么（≤80字）。',
    '- detail：干货正文 3-5 句，保留具体数字、公司/产品/机构名（保留原文，如 Novo Nordisk、FDA、QuantHealth）。说清楚怎么做、做到什么程度。',
    '- takeaway：一句给从业者的判断或行动建议。',
    '品牌名、产品名、机构名保留原文，其余正文用中文。',
    '严格返回 {"picks":[{index,title,summary,detail,takeaway}...]}，恰好 3 条，index 必须来自候选编号，按重要性排序。',
    '注意：所有字符串内部不要出现未转义的双引号；不要输出 Markdown；确保 JSON 完整闭合。',
    JSON.stringify(input),
  ].join('\n')

  const text = await complete(
    [{ role: 'user', content: prompt }],
    {
      env,
      system: '你是面向临床研究从业者的中文编辑，只返回合法 JSON，不要 Markdown。',
      maxTokens: 6000,
      temperature: 0.3,
    },
  )

  const parsed = pickedSchema.parse(JSON.parse(stripCodeFence(text)))

  const items: CroItemDraft[] = parsed.picks.map((pick, rankIndex) => {
    const candidate = pool[pick.index]
    return {
      rank: rankIndex + 1,
      section: candidate?.section ?? 'trial',
      title: pick.title,
      summary: pick.summary,
      detail: pick.detail,
      takeaway: pick.takeaway,
      sources: candidate?.sources ?? [],
    }
  })

  return {
    issueDate,
    issueNumber,
    headline: items[0]?.title ?? '今日 CRO + AI 精选',
    dek: items[0]?.summary ?? '',
    summary: '',
    sourceCount: items.reduce((count, item) => count + item.sources.length, 0),
    items,
  }
}

function stripCodeFence(value: string) {
  return value.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
}
