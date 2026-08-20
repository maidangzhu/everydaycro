import { getTranslations } from 'next-intl/server'
import { getLatestCroIssue } from '@everydaycro/content'
import { LEARNING_PATH } from '@everydaycro/content/learning-path'
import { Card, CardContent } from '@everydaycro/ui'
import { Link } from '@/i18n/navigation'
import { GlossaryCard } from './Glossary'
import { NewsCard } from './components/NewsCard'
import { SectionHead } from './components/SectionHead'
import { MemberCard } from './components/MemberCard'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [t, issue] = await Promise.all([getTranslations('home'), getLatestCroIssue()])
  const firstWeek = LEARNING_PATH[0]

  return (
    <div className="space-y-10">
      {/* ===== 会员卡（签到/积分） ===== */}
      <MemberCard />

      {/* ===== 今日精选 ===== */}
      <section>
        <SectionHead
          title={t('todayTitle')}
          sub={t('todaySub')}
          action={
            <Link href="/archive" className="text-sm text-primary hover:underline">
              {t('archiveLink')} →
            </Link>
          }
        />
        {issue ? (
          <div className="grid gap-4 md:grid-cols-2">
            {issue.items.slice(0, 4).map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                issueDate={new Date(issue.issueDate).toISOString().slice(0, 10)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">{t('empty')}</CardContent>
          </Card>
        )}
      </section>

      {/* ===== 学习路径钩子 ===== */}
      {firstWeek ? (
        <section>
          <SectionHead title={t('pathTitle')} sub={t('pathSub')} />
          <Link href="/learn">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <div className="font-serif text-lg font-semibold">
                    {t('weekN', { week: firstWeek.week })} · {firstWeek.title}
                  </div>
                  <div className="text-sm text-muted-foreground">{firstWeek.desc}</div>
                </div>
                <span className="text-primary">{t('start')} →</span>
              </CardContent>
            </Card>
          </Link>
        </section>
      ) : null}

      {/* ===== 名词速查 ===== */}
      <section>
        <SectionHead title={t('glossaryTitle')} sub={t('glossarySub')} />
        <GlossaryCard />
      </section>
    </div>
  )
}
