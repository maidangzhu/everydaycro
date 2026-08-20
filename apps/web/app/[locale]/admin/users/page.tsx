import { getTranslations } from 'next-intl/server'
import { prisma } from '@everydaycro/db'
import { getSessionUser } from '../../lib/session'
import { UserRow } from './UserRow'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const [t, session] = await Promise.all([
    getTranslations('admin.usersPage'),
    getSessionUser(),
  ])
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { points: true },
  })

  return (
    <div>
      <h1 className="mb-4 font-serif text-2xl font-bold">{t('title')}</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="p-2">{t('email')}</th>
              <th className="p-2">{t('name')}</th>
              <th className="p-2">{t('role')}</th>
              <th className="p-2">{t('points')}</th>
              <th className="p-2">{t('status')}</th>
              <th className="p-2">{t('joined')}</th>
              <th className="p-2">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <UserRow
                key={u.id}
                user={{
                  id: u.id,
                  email: u.email,
                  name: u.name,
                  role: u.role,
                  banned: u.banned,
                  points: u.points?.balance ?? 0,
                  createdAt: u.createdAt.toISOString().slice(0, 10),
                }}
                isSelf={u.id === session?.user.id}
                labels={{
                  active: t('active'),
                  banned: t('banned'),
                  ban: t('ban'),
                  unban: t('unban'),
                  save: t('save'),
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
