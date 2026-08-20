import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { searchCroNewsWithExa } from '@everydaycro/content'

/** Exa 网络搜索：站内素材不够时查公开网络上的行业动态。 */
export default defineTool({
  description:
    '搜索公开网络上的临床研究/AI 行业新闻（Exa）。仅当站内日报/专栏没有覆盖用户问题、或用户明确要最新外部信息时使用。',
  inputSchema: z.object({
    query: z.string().min(2).max(200),
    limit: z.number().int().min(1).max(10).default(5),
    lookbackDays: z.number().int().min(1).max(90).default(30),
  }),
  async execute({ query, limit, lookbackDays }) {
    const apiKey = process.env.EXA_API_KEY ?? ''
    if (!apiKey.trim()) {
      return { available: false, reason: '未配置 EXA_API_KEY，暂不支持联网搜索' }
    }

    const results = await searchCroNewsWithExa({
      apiKey,
      query,
      limit,
      lookbackDays,
      category: 'news',
    })

    return {
      available: true,
      query,
      count: results.length,
      results: results.map((r) => ({
        title: r.title,
        url: r.url,
        source: r.sourceName,
        publishedAt: r.publishedAt ?? null,
        snippet: r.snippet,
      })),
    }
  },
})
