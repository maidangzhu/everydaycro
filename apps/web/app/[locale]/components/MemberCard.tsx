import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { prisma } from '@everydaycro/db'
import { getSessionUser } from '../lib/session'
import { getUserPoints, levelInfo, todayKey } from '../lib/points'
import { CheckInButton } from './CheckInButton'

/** 首页会员卡：登录显示签到/积分/等级/连续天数；未登录引导注册。 */
export async function MemberCard() {
  const t = await getTranslations('member')
  const session = await getSessionUser()

  if (!session) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-5 py-4">
        <p className="text-sm text-muted-foreground">{t('loginPrompt')}</p>
        <Link
          href="/register"
          className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t('goLogin')}
        </Link>
      </div>
    )
  }

  const userId = session.user.id
  const [points, today] = await Promise.all([
    getUserPoints(userId),
    prisma.dailyCheckIn.findUnique({
      where: { userId_day: { userId, day: todayKey() } },
    }),
  ])
  const latest = await prisma.dailyCheckIn.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  const level = levelInfo(points.totalEarned)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card px-5 py-4">
      <div>
        <div className="font-serif text-lg font-semibold">{t('greeting', { name: session.user.name })}</div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            {t('points')}：<span className="font-semibold text-primary">{points.balance}</span>
          </span>
          <span>
            {t('level')}：Lv.{level.level} · {level.title}
          </span>
          <span>
            {t('streak')}：{today?.streak ?? latest?.streak ?? 0} {t('days')}
          </span>
          {level.next ? <span>{t('nextLevel', { points: level.toNext })}</span> : null}
        </div>
      </div>
      <CheckInButton checkedIn={Boolean(today)} />
    </div>
  )
}
