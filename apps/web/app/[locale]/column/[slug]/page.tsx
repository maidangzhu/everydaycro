import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getPostBySlug } from '@everydaycro/content'
import { Badge } from '@everydaycro/ui'
import { Link } from '@/i18n/navigation'
import { Markdown } from '../../components/Markdown'
import { FavoriteButton } from '../../components/FavoriteButton'
import { getSessionUser } from '../../lib/session'
import { getFavoriteIds } from '../../lib/favorites'

export const dynamic = 'force-dynamic'

export default async function ColumnPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const [t, session] = await Promise.all([getTranslations('news'), getSessionUser()])
  const fav = session ? (await getFavoriteIds(session.user.id, 'post', [post.id])).has(post.id) : undefined

  return (
    <article className="mx-auto max-w-2xl">
      <Link href="/column" className="mb-4 inline-block text-sm text-primary hover:underline">
        {t('back')}
      </Link>
      <div className="mb-2 flex flex-wrap gap-1">
        {post.tags.map((t) => (
          <Badge key={t} variant="secondary">
            {t}
          </Badge>
        ))}
      </div>
      <h1 className="mb-2 font-serif text-4xl font-bold leading-tight">{post.title}</h1>
      <p className="mb-6 text-lg text-muted-foreground">{post.dek}</p>
      <Markdown text={post.body} />
      <div className="mt-8">
        <FavoriteButton id={post.id} kind="post" initialHas={fav} />
      </div>
    </article>
  )
}
