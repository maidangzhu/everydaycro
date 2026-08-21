import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { SectionHead } from '../components/SectionHead'
import { AgentChat } from './AgentChat'
import { getSessionUser } from '../lib/session'

export const metadata = { title: 'AI 助手' }

export default async function AgentPage() {
  const [t, session] = await Promise.all([getTranslations('agent'), getSessionUser()])

  return (
    <div className="space-y-6">
      <SectionHead title={t('title')} sub={t('sub')} />
      {session ? (
        <AgentChat />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-5 py-4">
          <p className="text-sm text-muted-foreground">{t('loginRequired')}</p>
          <Link
            href="/login"
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t('goLogin')}
          </Link>
        </div>
      )}
    </div>
  )
}
