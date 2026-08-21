import { getTranslations } from 'next-intl/server'
import { listCroIssues } from '@everydaycro/content'
import { Card, CardContent } from '@everydaycro/ui'
import { Link } from '@/i18n/navigation'
import { SectionHead } from '../components/SectionHead'

export const dynamic = 'force-dynamic'
export const metadata = { title: '精选日报' }

export default async function ArchivePage() {
  const [t, issues] = await Promise.all([getTranslations('archivePage'), listCroIssues(30)])

  return (
    <div>
      <SectionHead title={t('title')} sub={t('sub')} />
      {issues.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      ) : (
        <div className="grid gap-3">
          {issues.map((issue) => {
            const date = new Date(issue.issueDate).toISOString().slice(0, 10)
            return (
              <Link key={issue.id} href={`/issue/${date}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-serif text-lg font-semibold">{issue.headline}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('issueMeta', { n: issue.issueNumber, count: issue.items.length })}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{date}</span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
