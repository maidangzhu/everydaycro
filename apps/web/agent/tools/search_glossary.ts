import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { searchGlossary } from '@everydaycro/content/quiz'

/** 行业名词速查（缩写/英文/中文均可搜）。 */
export default defineTool({
  description:
    '搜索临床研究行业名词速查表（支持缩写、英文、中文，如 CRA、监查员、EDC、GCP）。解释行业术语时优先用它，保证与站内词条一致。',
  inputSchema: z.object({
    query: z.string().min(1).max(40),
  }),
  async execute({ query }) {
    const results = searchGlossary(query).slice(0, 8)
    return { query, count: results.length, terms: results }
  },
})
