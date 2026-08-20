import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import '../globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import { SiteNav } from './components/SiteNav'

export const metadata: Metadata = {
  title: {
    default: 'everydaycro · CRO × AI 每日精选',
    template: '%s · everydaycro',
  },
  description: '每天整理海外 CRO（临床合同研究）与 AI 结合的最新进展，附行业知识学习路径。',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }
  setRequestLocale(locale)

  const messages = await getMessages()
  const t = await getTranslations('footer')

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <SiteNav />
            <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 md:pb-10">{children}</main>
            <footer className="border-t py-8 text-center text-sm text-muted-foreground">
              <p>{t('tagline')}</p>
            </footer>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
