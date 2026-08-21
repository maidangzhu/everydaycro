import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getWeek, getWeekQuestions } from '@everydaycro/content/learning-path'
import { Link } from '@/i18n/navigation'
import { SectionHead } from '../../../components/SectionHead'
import { PathQuiz } from './PathQuiz'

export const dynamic = 'force-dynamic'

export default async function WeekPathPage({
  params,
}: {
  params: Promise<{ week: string }>
}) {
  const { week: slug } = await params
  const week = getWeek(slug)
  if (!week) notFound()
  const [questions, t] = await Promise.all([getWeekQuestions(slug), getTranslations('news')])

  return (
    <div>
      <Link href="/learn" className="mb-4 inline-block text-sm text-primary hover:underline">
        {t('backLearn')}
      </Link>
      <SectionHead
        title={`第 ${week.week} 周 · ${week.title}`}
        sub={week.desc}
      />
      <PathQuiz questions={questions} weekSlug={slug} />
    </div>
  )
}
