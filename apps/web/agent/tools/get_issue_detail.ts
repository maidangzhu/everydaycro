import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { getCroIssueByDate } from '@everydaycro/content'

/** 按日期取某期日报的完整内容（含每条的来源链接）。 */
export default defineTool({
  description:
    '按日期（YYYY-MM-DD）获取某一期「每日精选」日报的完整内容，含每条新闻的来源链接。查历史某一天的日报时用它。',
  inputSchema: z.object({
    issueDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式 YYYY-MM-DD'),
  }),
  async execute({ issueDate }) {
    const issue = await getCroIssueByDate(issueDate)
    if (!issue) return { found: false, issueDate }

    return {
      found: true,
      issueNumber: issue.issueNumber,
      issueDate: issue.issueDate.toISOString().slice(0, 10),
      headline: issue.headline,
      dek: issue.dek,
      summary: issue.summary,
      items: issue.items.map((item) => ({
        rank: item.rank,
        section: item.section,
        title: item.title,
        summary: item.summary,
        detail: item.detail,
        takeaway: item.takeaway,
        sources: item.sources.map((s) => ({
          title: s.title,
          url: s.url,
          publisher: s.publisher,
        })),
      })),
    }
  },
})
