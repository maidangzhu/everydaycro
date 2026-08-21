import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { getLatestCroIssue } from '@everydaycro/content'

/** 最近一期每日精选（条目含摘要与要点，不含来源明细）。 */
export default defineTool({
  description:
    '获取最近一期「每日精选」日报：期号、日期、头条、条目标题/摘要/要点。用户问"最新一期讲了什么"时用它。',
  inputSchema: z.object({}),
  async execute() {
    const issue = await getLatestCroIssue()
    if (!issue) return { found: false }

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
        takeaway: item.takeaway,
      })),
    }
  },
})
