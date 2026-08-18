import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getWeek,
  getWeekQuestions,
} from '@everydaycro/content/learning-path'
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
  const questions = getWeekQuestions(slug)

  return (
    <div>
      <Link href="/learn" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← 返回学习中心
      </Link>
      <SectionHead
        title={`第 ${week.week} 周 · ${week.title}`}
        sub={week.desc}
      />
      <PathQuiz questions={questions} weekSlug={slug} />
    </div>
  )
}
