'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { authClient } from '../lib/auth-client'
import { levelInfo } from '../lib/points.client'

type Props = {
  user: { name: string; email: string; role: string } | null
  points: { balance: number; totalEarned: number } | null
}

/** 导航右侧用户区：未登录给入口，登录后头像菜单（积分等级/后台/退出）。 */
export function UserMenu({ user, points }: Props) {
  const t = useTranslations('nav')
  const router = useRouter()
  const [open, setOpen] = useState(false)

  if (!user) {
    return (
      <div className="flex items-center gap-1">
        <Link
          href="/login"
          className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {t('login')}
        </Link>
        <Link
          href="/register"
          className="rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t('register')}
        </Link>
      </div>
    )
  }

  const level = points ? levelInfo(points.totalEarned) : null

  async function signOut() {
    await authClient.signOut()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
        aria-label={user.name}
      >
        {(user.name || user.email).slice(0, 1).toUpperCase()}
      </button>
      {open ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border bg-card shadow-lg">
            <div className="border-b px-4 py-3">
              <div className="truncate text-sm font-semibold">{user.name}</div>
              <div className="truncate text-xs text-muted-foreground">{user.email}</div>
              {level ? (
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Lv.{level.level} · {level.title}
                  </span>
                  <span className="font-semibold text-primary">{points?.balance} 分</span>
                </div>
              ) : null}
            </div>
            <div className="p-1 text-sm">
              {user.role === 'admin' ? (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  {t('admin')}
                </Link>
              ) : null}
              <button
                type="button"
                onClick={signOut}
                className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
