import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'everydaycro · CRO + AI 日报',
  description: '每天整理海外 CRO（临床合同研究）与 AI 结合的最新进展。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="site">
          <header className="site-header">
            <a className="brand" href="/">
              everydaycro
            </a>
            <nav className="nav">
              <a href="/">最新</a>
              <a href="/archive">归档</a>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <p>每天自动整理海外医药网站与公开来源中，AI 在临床合同研究（CRO）领域的新动向。</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
