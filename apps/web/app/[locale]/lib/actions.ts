'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@everydaycro/db'
import { getWeekQuestions } from '@everydaycro/content/learning-path'
import { getSessionUser } from './session'
import { awardPoints, todayKey, yesterdayKey } from './points'

/** 每日签到：连续签到记 streak，幂等（当天重复调用返回 already）。 */
export async function checkInAction(): Promise<
  { ok: true; streak: number } | { ok: false; error: 'unauth' | 'already' }
> {
  const session = await getSessionUser()
  if (!session) return { ok: false, error: 'unauth' }

  const day = todayKey()
  const existing = await prisma.dailyCheckIn.findUnique({
    where: { userId_day: { userId: session.user.id, day } },
  })
  if (existing) return { ok: false, error: 'already' }

  const yesterday = await prisma.dailyCheckIn.findUnique({
    where: { userId_day: { userId: session.user.id, day: yesterdayKey() } },
  })
  const streak = (yesterday?.streak ?? 0) + 1

  await prisma.dailyCheckIn.create({
    data: { userId: session.user.id, day, streak },
  })
  await awardPoints(session.user.id, 'daily_checkin', 'day', day)

  revalidatePath('/')
  return { ok: true, streak }
}

/** 登录用户收藏同步（匿名走 localStorage，见 FavoriteButton）。 */
export async function toggleFavoriteAction(
  kind: 'news' | 'post',
  targetId: string,
  on: boolean,
): Promise<{ ok: boolean }> {
  const session = await getSessionUser()
  if (!session) return { ok: false }

  if (on) {
    await prisma.favorite
      .create({ data: { userId: session.user.id, kind, targetId } })
      .catch(() => {}) // 已收藏
  } else {
    await prisma.favorite
      .deleteMany({ where: { userId: session.user.id, kind, targetId } })
      .catch(() => {})
  }
  return { ok: true }
}

/** 登录用户学习进度同步：整周 upsert，doneIds 去重。 */
export async function syncWeekProgressAction(
  week: string,
  doneIds: string[],
): Promise<{ ok: boolean }> {
  const session = await getSessionUser()
  if (!session) return { ok: false }

  const unique = [...new Set(doneIds)]
  await prisma.learningProgress.upsert({
    where: { userId_week: { userId: session.user.id, week } },
    create: { userId: session.user.id, week, doneIds: unique },
    update: {
      doneIds: { set: unique },
    },
  })

  // 该周全部答对 → 周完成奖励（幂等由 ledger 唯一约束保证）
  const total = getWeekQuestions(week).length
  if (total > 0 && unique.length >= total) {
    await awardPoints(session.user.id, 'week_complete', 'week', week)
  }
  return { ok: true }
}

/** 登录用户阅读单条资讯 +2 分（幂等，每条只发一次）。 */
export async function readItemAction(
  targetId: string,
): Promise<{ ok: boolean }> {
  const session = await getSessionUser()
  if (!session) return { ok: false }
  await awardPoints(session.user.id, 'read_item', 'item', targetId)
  return { ok: true }
}

/** 登录用户答对题目 +3 分（幂等，每题只发一次）。 */
export async function awardQuizPointsAction(
  questionId: string,
): Promise<{ ok: boolean }> {
  const session = await getSessionUser()
  if (!session) return { ok: false }
  await awardPoints(session.user.id, 'quiz_correct', 'quiz', questionId)
  return { ok: true }
}
