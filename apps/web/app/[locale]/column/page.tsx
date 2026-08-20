import { getTranslations } from 'next-intl/server'
import { listPosts } from '@everydaycro/content'
import { Badge, Card, CardContent } from '@everydaycro/ui'
import { Link } from '@/i18n/navigation'
import { SectionHead } from '../components/SectionHead'

export const dynamic = 'force-dynamic'
export const metadata = { title: '深度专栏' }

export default async function ColumnPage() {
  const [t, posts] = await Promise.all([getTranslations('columnPage'), listPosts(30)])

  return (
    <div>
      <SectionHead title={t('title')} sub={t('sub')} />
      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">{t('empty')}</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Link key={post.id} href={`/column/${post.slug}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="mb-1 flex flex-wrap gap-1">
                    {post.tags.map((t) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <div className="mb-1 font-serif text-xl font-semibold">{post.title}</div>
                  <p className="text-sm text-muted-foreground">{post.dek}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
