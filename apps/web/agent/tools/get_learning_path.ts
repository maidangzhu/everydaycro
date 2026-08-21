import { defineTool } from 'eve/tools'
import { z } from 'zod'
import {
  LEARNING_PATH,
  getWeekQuestions,
} from '@everydaycro/content/learning-path'

/** 入门学习路径的编排结构（每周主题与题目数量），含第 5 周新版 GCP 专题。 */
export default defineTool({
  description:
    '获取站内「CRO 入门学习路径」（4 周入门 + 第 5 周新版 GCP 专题：ICH E6(R3) 与中国 2026 版 GCP）：每周的主题、简介与题目数量。用户问学习路径/从哪学起时用它。',
  inputSchema: z.object({}),
  async execute() {
    return {
      weeks: LEARNING_PATH.map((week) => ({
        week: week.week,
        slug: week.slug,
        title: week.title,
        desc: week.desc,
        questionCount: getWeekQuestions(week.slug).length,
      })),
    }
  },
})
