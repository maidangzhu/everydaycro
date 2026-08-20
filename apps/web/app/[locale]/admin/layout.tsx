import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { isAdminUser } from '@everydaycro/auth'
import { getSessionUser } from '../lib/session'

export const dynamic = 'force-dynamic'

/** 后台守卫：非 admin 一律打回首页（middleware 放行后在页面层校验）。 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser()
  if (!session) redirect('/login')
  if (!isAdminUser(session.user)) redirect('/')

  const t = await getTranslations('admin')
  const nav = [
    { href: '/admin', label: t('dashboard') },
    { href: '/admin/users', label: t('users') },
    { href: '/admin/content', label: t('content') },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-[180px_1fr]">
      <aside className="md:border-r md:pr-4">
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/"
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {t('backToSite')}
          </Link>
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
