import { notFound } from 'next/navigation'
import { getCroIssueByDate } from '@everydaycro/content'
import { NewsItemDetail } from '../../../IssueView'

export const dynamic = 'force-dynamic'

export default async function NewsItemPage({
  params,
}: {
  params: Promise<{ date: string; rank: string }>
}) {
  const { date, rank } = await params
  const issue = await getCroIssueByDate(date)
  if (!issue) notFound()
  const item = issue.items.find((it) => it.rank === Number(rank))
  if (!item) notFound()
  return <NewsItemDetail item={item} issueDate={date} />
}
