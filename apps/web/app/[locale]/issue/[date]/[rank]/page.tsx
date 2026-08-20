import { notFound } from 'next/navigation'
import { getCroIssueByDate } from '@everydaycro/content'
import { getSessionUser } from '../../../lib/session'
import { getFavoriteIds } from '../../../lib/favorites'
import { readItemAction } from '../../../lib/actions'
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

  const session = await getSessionUser()
  let fav: boolean | undefined
  if (session) {
    const ids = await getFavoriteIds(session.user.id, 'news', [item.id])
    fav = ids.has(item.id)
    // 登录用户阅读奖励（每条幂等一次）
    await readItemAction(item.id)
  }

  return <NewsItemDetail item={item} issueDate={date} fav={fav} />
}
