'use client'

import { useLocale } from 'next-intl'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'

/** 语言切换：zh（默认，无前缀）⇄ en（/en 前缀）。 */
export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()
  const next = locale === 'zh' ? 'en' : 'zh'

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(() => {
          router.replace(pathname, { locale: next })
        })
      }
      className="rounded-full px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      aria-label={next === 'en' ? 'Switch to English' : '切换为中文'}
    >
      {next === 'en' ? 'EN' : '中'}
    </button>
  )
}
