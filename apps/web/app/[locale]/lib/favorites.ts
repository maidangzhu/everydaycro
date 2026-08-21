import { prisma } from '@everydaycro/db'

/** 批量取登录用户某类收藏的 targetId 集合（页面初始态用）。 */
export async function getFavoriteIds(
  userId: string | null | undefined,
  kind: 'news' | 'post',
  ids: string[],
): Promise<Set<string>> {
  if (!userId || ids.length === 0) return new Set()
  const rows = await prisma.favorite.findMany({
    where: { userId, kind, targetId: { in: ids } },
    select: { targetId: true },
  })
  return new Set(rows.map((r) => r.targetId))
}
