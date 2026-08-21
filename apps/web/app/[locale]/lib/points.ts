import { prisma } from '@everydaycro/db'
import { POINT_RULES, LEVELS, LEVEL_TITLES, levelInfo } from './points.client'

export { POINT_RULES, LEVELS, LEVEL_TITLES, levelInfo }
export type PointReason = keyof typeof POINT_RULES

/**
 * 发积分（幂等）：(userId, reason, refType, refId) 已存在则不发。
 * 返回本次实际入账积分（重复/失败为 0）。
 */
export async function awardPoints(
  userId: string,
  reason: PointReason,
  refType = '',
  refId = '',
): Promise<number> {
  const amount = POINT_RULES[reason]
  try {
    const created = await prisma.pointLedger.create({
      data: { userId, amount, reason, refType, refId },
    })
    await prisma.userPoints.upsert({
      where: { userId },
      create: { userId, balance: amount, totalEarned: amount },
      update: {
        balance: { increment: amount },
        totalEarned: { increment: amount },
      },
    })
    return created ? amount : 0
  } catch {
    // 唯一约束冲突 = 该条目已发过，幂等跳过
    return 0
  }
}

/** 拿用户积分概览（未初始化时返回 0）。 */
export async function getUserPoints(userId: string) {
  const row = await prisma.userPoints.findUnique({ where: { userId } })
  return row ?? { userId, balance: 0, totalEarned: 0, updatedAt: new Date() }
}

/** 今天是否已签到（Asia/Shanghai 日期串）。 */
export function todayKey(): string {
  const now = new Date()
  const shanghai = new Date(now.getTime() + 8 * 3600 * 1000)
  return shanghai.toISOString().slice(0, 10)
}

export function yesterdayKey(): string {
  const now = new Date()
  const shanghai = new Date(now.getTime() + 8 * 3600 * 1000 - 24 * 3600 * 1000)
  return shanghai.toISOString().slice(0, 10)
}
