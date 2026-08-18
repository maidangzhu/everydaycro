import Link from 'next/link'
import { listPosts } from '@everydaycro/content'
import { Badge, Card, CardContent } from '@everydaycro/ui'
import { SectionHead } from '../components/SectionHead'

export const dynamic = 'force-dynamic'
export const metadata = { title: '深度专栏' }

export default async function ColumnPage() {
  const posts = await listPosts(30)

  return (
    <div>
      <SectionHead title="深度专栏" sub="AI 基于每日精选沉淀的专题长文" />
      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            还没有专栏。运行 <code>pnpm generate:column</code> 基于近期精选生成第一篇。
          </CardContent>
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
                  <div className="mb-1 text-lg font-semibold">{post.title}</div>
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
