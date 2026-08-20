import { notFound } from 'next/navigation'
import { getCroIssueByDate } from '@everydaycro/content'
import { getSessionUser } from '../../lib/session'
import { getFavoriteIds } from '../../lib/favorites'
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

  const session = await getSessionUser()
  const favIds = session
    ? await getFavoriteIds(
        session.user.id,
        'news',
        issue.items.map((i) => i.id),
      )
    : undefined

  return <IssueView issue={issue} favIds={favIds} />
}
