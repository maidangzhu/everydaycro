import Link from 'next/link'
import { listCroIssues } from '@everydaycro/content'
import { Card, CardContent } from '@everydaycro/ui'
import { SectionHead } from '../components/SectionHead'

export const dynamic = 'force-dynamic'
export const metadata = { title: '精选日报' }

export default async function ArchivePage() {
  const issues = await listCroIssues(30)

  return (
    <div>
      <SectionHead title="精选日报" sub="每天一期，海外 CRO × AI 动向" />
      {issues.length === 0 ? (
        <p className="text-sm text-muted-foreground">还没有任何一期。</p>
      ) : (
        <div className="grid gap-3">
          {issues.map((issue) => {
            const date = new Date(issue.issueDate).toISOString().slice(0, 10)
            return (
              <Link key={issue.id} href={`/issue/${date}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-semibold">{issue.headline}</div>
                      <div className="text-sm text-muted-foreground">
                        第 {issue.issueNumber} 期 · 精选 {issue.items.length} 条
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
