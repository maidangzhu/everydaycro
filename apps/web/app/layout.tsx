import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import { SiteNav } from './components/SiteNav'

export const metadata: Metadata = {
  title: {
    default: 'everydaycro · CRO × AI 每日精选',
    template: '%s · everydaycro',
  },
  description: '每天整理海外 CRO（临床合同研究）与 AI 结合的最新进展，附行业知识学习路径。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SiteNav />
          <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 md:pb-10">{children}</main>
          <footer className="border-t py-8 text-center text-sm text-muted-foreground">
            <p>每天自动整理海外医药网站与公开来源中，AI 在临床合同研究（CRO）领域的新动向。</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
