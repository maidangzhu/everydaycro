import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug } from '@everydaycro/content'
import { Badge } from '@everydaycro/ui'
import { Markdown } from '../../components/Markdown'
import { FavoriteButton } from '../../components/FavoriteButton'

export const dynamic = 'force-dynamic'

export default async function ColumnPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-2xl">
      <Link href="/column" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← 返回专栏
      </Link>
      <div className="mb-2 flex flex-wrap gap-1">
        {post.tags.map((t) => (
          <Badge key={t} variant="secondary">
            {t}
          </Badge>
        ))}
      </div>
      <h1 className="mb-2 text-3xl font-bold leading-tight">{post.title}</h1>
      <p className="mb-6 text-lg text-muted-foreground">{post.dek}</p>
      <Markdown text={post.body} />
      <div className="mt-8">
        <FavoriteButton id={post.id} kind="post" />
      </div>
    </article>
  )
}
