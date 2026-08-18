import { notFound } from 'next/navigation'
import { getCroIssueByDate } from '@everydaycro/content'
import { IssueView } from '../../IssueView'

export const dynamic = 'force-dynamic'

export default async function IssuePage({
  params,
}: {
  params: Promise<{ date: string }>
}) {
  const { date } = await params
  const issue = await getCroIssueByDate(date)
  if (!issue) notFound()
  return <IssueView issue={issue} />
}
