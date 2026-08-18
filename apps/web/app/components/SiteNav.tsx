import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

const NAV = [
  { href: '/', label: '首页' },
  { href: '/archive', label: '精选日报' },
  { href: '/learn', label: '学习中心' },
  { href: '/column', label: '深度专栏' },
]

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-primary">
          everydaycro
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
      {/* 移动端底部 Tab */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background md:hidden">
        {NAV.map((n) => (
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
