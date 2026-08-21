import { getTranslations } from 'next-intl/server'
import { listCroIssues } from '@everydaycro/content'
import { prisma } from '@everydaycro/db'
import { Link } from '@/i18n/navigation'
import { GenerateButtons, PostPublishToggle } from './ContentClient'

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  const [t, issues, posts] = await Promise.all([
    getTranslations('admin.contentPage'),
    listCroIssues(10),
    prisma.post.findMany({ take: 20, orderBy: { createdAt: 'desc' } }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">{t('title')}</h1>

      <GenerateButtons
        labels={{
          issue: t('generateIssue'),
          post: t('generatePost'),
          generating: t('generating'),
          ok: t('generateOk'),
          failed: t('generateFailed'),
        }}
      />

      <section>
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">{t('issueList')}</h2>
        <div className="space-y-2 text-sm">
          {issues.map((issue) => (
            <Link
              key={issue.id}
              href={`/issue/${new Date(issue.issueDate).toISOString().slice(0, 10)}`}
              className="block rounded-lg border p-3 hover:bg-accent"
            >
              #{issue.issueNumber} · {issue.headline} · {issue.items.length} {t('items')}
            </Link>
          ))}
          {issues.length === 0 ? (
            <p className="text-sm text-muted-foreground">—</p>
          ) : null}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">{t('postList')}</h2>
        <div className="space-y-2 text-sm">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between rounded-lg border p-3">
              <Link href={`/column/${post.slug}`} className="min-w-0 flex-1 hover:underline">
                {post.title}
              </Link>
              <PostPublishToggle
                postId={post.id}
                published={post.publishedAt !== null}
                labels={{
                  published: t('published'),
                  draft: t('draft'),
                  publish: t('publish'),
                  unpublish: t('unpublish'),
                }}
              />
            </div>
          ))}
          {posts.length === 0 ? <p className="text-sm text-muted-foreground">—</p> : null}
        </div>
      </section>
    </div>
  )
}
