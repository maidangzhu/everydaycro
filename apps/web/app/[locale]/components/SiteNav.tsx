import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ThemeToggle } from './ThemeToggle'
import { LocaleSwitcher } from './LocaleSwitcher'
import { UserMenu } from './UserMenu'
import { getSessionUser } from '../lib/session'
import { getUserPoints } from '../lib/points'

export async function SiteNav() {
  const t = await getTranslations('nav')
  const session = await getSessionUser()
  const points = session ? await getUserPoints(session.user.id) : null

  const nav = [
    { href: '/', label: t('home') },
    { href: '/archive', label: t('archive') },
    { href: '/learn', label: t('learn') },
    { href: '/column', label: t('column') },
    { href: '/agent', label: t('agent') },
  ] as const

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-primary">
          everydaycro
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <LocaleSwitcher />
          <ThemeToggle />
          <UserMenu
            user={
              session
                ? {
                    name: session.user.name,
                    email: session.user.email,
                    role: session.user.role ?? 'user',
                  }
                : null
            }
            points={points ? { balance: points.balance, totalEarned: points.totalEarned } : null}
          />
        </div>
      </div>
      {/* 移动端底部 Tab */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background md:hidden">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="flex-1 py-3 text-center text-xs text-muted-foreground hover:text-primary"
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
