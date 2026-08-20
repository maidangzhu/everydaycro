import { getTranslations } from 'next-intl/server'
import {
  LEARNING_PATH,
  getWeekQuestions,
} from '@everydaycro/content/learning-path'
import { prisma } from '@everydaycro/db'
import { SectionHead } from '../components/SectionHead'
import { WeekProgressCard } from './WeekProgressCard'
import { GlossaryCard } from '../Glossary'
import { getSessionUser } from '../lib/session'

export const metadata = { title: '学习中心' }

export default async function LearnPage() {
  const [t, session] = await Promise.all([getTranslations('learnPage'), getSessionUser()])

  // 登录用户：云端学习进度合并展示
  let serverDone: Record<string, number> = {}
  if (session) {
    const rows = await prisma.learningProgress.findMany({
      where: { userId: session.user.id },
      select: { week: true, doneIds: true },
    })
    serverDone = Object.fromEntries(rows.map((r) => [r.week, r.doneIds.length]))
  }

  return (
    <div className="space-y-10">
      <section>
        <SectionHead title={t('pathTitle')} sub={t('pathSub')} />
        <div className="grid gap-4 sm:grid-cols-2">
          {LEARNING_PATH.map((week) => (
            <WeekProgressCard
              key={week.slug}
              week={{ ...week, total: getWeekQuestions(week.slug).length }}
              initialDone={serverDone[week.slug]}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHead title={t('glossaryTitle')} sub={t('glossarySub')} />
        <GlossaryCard />
      </section>
    </div>
  )
}
