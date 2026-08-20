import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { prisma } from '@everydaycro/db'

/** 跨期关键词搜索日报条目（标题/摘要/板块）。 */
export default defineTool({
  description:
    '按关键词搜索近期「每日精选」日报里的条目（匹配标题、摘要、板块，如 "AI 招募"、"FDA"、"Medidata"）。找某个主题出现在哪些日报里时用它。',
  inputSchema: z.object({
    keyword: z.string().min(1).max(60),
    limit: z.number().int().min(1).max(20).default(8),
  }),
  async execute({ keyword, limit }) {
    const items = await prisma.croItem.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { summary: { contains: keyword, mode: 'insensitive' } },
          { section: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        rank: true,
        section: true,
        title: true,
        summary: true,
        takeaway: true,
        issue: { select: { issueNumber: true, issueDate: true } },
      },
    })

    return {
      keyword,
      count: items.length,
      items: items.map((item) => ({
        issueDate: item.issue.issueDate.toISOString().slice(0, 10),
        issueNumber: item.issue.issueNumber,
        section: item.section,
        title: item.title,
        summary: item.summary,
        takeaway: item.takeaway,
      })),
    }
  },
})
