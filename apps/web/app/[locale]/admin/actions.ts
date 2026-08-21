'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@everydaycro/db'
import { generateCroIssue, generateColumnPost } from '@everydaycro/content'
import { isAdminUser } from '@everydaycro/auth'
import { getSessionUser } from '../lib/session'

/** 统一后台权限校验：admin 角色（或 ADMIN_USER_IDS 自举账号）。 */
export async function requireAdmin() {
  const session = await getSessionUser()
  if (!session || !isAdminUser(session.user)) {
    throw new Error('forbidden')
  }
  return session
}

export async function setUserRoleAction(userId: string, role: string): Promise<{ ok: boolean }> {
  await requireAdmin()
  if (!['user', 'editor', 'admin'].includes(role)) return { ok: false }
  await prisma.user.update({ where: { id: userId }, data: { role } })
  revalidatePath('/admin/users')
  return { ok: true }
}

export async function setBannedAction(
  userId: string,
  banned: boolean,
): Promise<{ ok: boolean }> {
  const session = await requireAdmin()
  // 不允许封自己
  if (session.user.id === userId) return { ok: false }
  await prisma.user.update({
    where: { id: userId },
    data: banned
      ? { banned: true, banCount: { increment: 1 } }
      : { banned: false, banReason: null, banExpires: null },
  })
  revalidatePath('/admin/users')
  return { ok: true }
}

export async function setPostPublishedAction(
  postId: string,
  published: boolean,
): Promise<{ ok: boolean }> {
  await requireAdmin()
  await prisma.post.update({
    where: { id: postId },
    data: { publishedAt: published ? new Date() : null },
  })
  revalidatePath('/admin/content')
  revalidatePath('/column')
  return { ok: true }
}

export async function generateIssueAction(): Promise<
  { ok: true; issueDate: string } | { ok: false; error: string }
> {
  await requireAdmin()
  try {
    const result = await generateCroIssue({ force: false })
    revalidatePath('/')
    revalidatePath('/admin/content')
    return { ok: true, issueDate: String(result.issue.issueDate) }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'failed' }
  }
}

export async function generatePostAction(): Promise<
  { ok: true; slug: string } | { ok: false; error: string }
> {
  await requireAdmin()
  try {
    const post = await generateColumnPost({})
    revalidatePath('/column')
    revalidatePath('/admin/content')
    return { ok: true, slug: post.slug }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'failed' }
  }
}
