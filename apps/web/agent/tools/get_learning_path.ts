import { defineTool } from 'eve/tools'
import { z } from 'zod'
import {
  LEARNING_PATH,
  getWeekQuestions,
} from '@everydaycro/content/learning-path'

/** 四周入门学习路径的编排结构（每周主题与题目数量）。 */
export default defineTool({
  description:
    '获取站内「四周 CRO 入门学习路径」：每周的主题、简介与题目数量。用户问学习路径/从哪学起时用它。',
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
