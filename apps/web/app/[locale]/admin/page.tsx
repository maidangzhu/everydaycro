import { getTranslations } from 'next-intl/server'
import { listCroIssues } from '@everydaycro/content'
import { prisma } from '@everydaycro/db'
import { Card, CardContent } from '@everydaycro/ui'
import { Link } from '@/i18n/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const t = await getTranslations('admin')
  const [issueCount, userCount, postCount, ledgerSum, issues, recentPosts] = await Promise.all([
    prisma.croIssue.count(),
    prisma.user.count(),
    prisma.post.count(),
    prisma.userPoints.aggregate({ _sum: { totalEarned: true } }),
    listCroIssues(5),
    prisma.post.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
  ])

  const stats = [
    { label: t('stats.issues'), value: String(issueCount) },
    { label: t('stats.posts'), value: String(postCount) },
    { label: t('stats.users'), value: String(userCount) },
    { label: t('stats.pointsIssued'), value: String(ledgerSum._sum.totalEarned ?? 0) },
  ]

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">{t('dashboard')}</h1>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-2xl font-semibold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Digest / Posts</h2>
        <div className="space-y-2 text-sm">
          {issues.map((issue) => (
            <Link
              key={issue.id}
              href={`/issue/${new Date(issue.issueDate).toISOString().slice(0, 10)}`}
              className="block rounded-lg border p-3 hover:bg-accent"
            >
              #{issue.issueNumber} · {issue.headline}
            </Link>
          ))}
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/column/${post.slug}`}
              className="block rounded-lg border p-3 hover:bg-accent"
            >
              {post.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
