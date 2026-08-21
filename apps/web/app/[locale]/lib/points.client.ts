/** 客户端可用的积分纯函数（无 DB 依赖）。发放逻辑见 ./points.ts。 */

export const POINT_RULES = {
  daily_checkin: 5,
  read_item: 2,
  quiz_correct: 3,
  week_complete: 20,
} as const

/** 等级阈值与称号（按累计 totalEarned）。 */
export const LEVELS = [0, 50, 150, 300, 500, 800, 1200, 1800, 2600, 3600] as const
export const LEVEL_TITLES = [
  '见习研究员',
  '入门研究员',
  '上手研究员',
  '熟练研究员',
  '进阶研究员',
  '资深研究员',
  '专家研究员',
  '首席研究员',
  '行业权威',
  '传奇研究员',
] as const

export function levelInfo(total: number) {
  let level = 1
  for (let i = 0; i < LEVELS.length; i++) {
    if (total >= LEVELS[i]!) level = i + 1
  }
  const next = LEVELS[level]
  return {
    level,
    title: LEVEL_TITLES[level - 1]!,
    next: next ?? null,
    toNext: next ? Math.max(0, next - total) : 0,
  }
}
