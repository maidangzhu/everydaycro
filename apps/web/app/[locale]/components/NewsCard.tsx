import { getTranslations } from 'next-intl/server'
import type { CroIssueRecord } from '@everydaycro/content'
import { Badge, Card, CardContent } from '@everydaycro/ui'
import { Link } from '@/i18n/navigation'
import { FavoriteButton } from './FavoriteButton'
import { GlossaryText } from './GlossaryText'

type Item = CroIssueRecord['items'][number]

/** 单条资讯卡片：摘要视图（首页/期列表用），可点进详情。 */
export async function NewsCard({
  item,
  issueDate,
  fav,
}: {
  item: Item
  issueDate: string
  fav?: boolean
}) {
  const [t, tNews] = await Promise.all([
    getTranslations('sections'),
    getTranslations('news'),
  ])
  const date = new Date(issueDate).toISOString().slice(0, 10)
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">
            {String(item.rank).padStart(2, '0')}
          </span>
          <Badge variant="secondary">{t(item.section)}</Badge>
        </div>
        <Link href={`/issue/${date}/${item.rank}`} className="block">
          <h3 className="mb-1 font-serif text-lg font-semibold leading-snug hover:text-primary">
            {item.title}
          </h3>
        </Link>
        <p className="mb-3 text-sm text-muted-foreground">
          <GlossaryText text={item.summary} />
        </p>
        <div className="flex items-center justify-between">
          <Link
            href={`/issue/${date}/${item.rank}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {tNews('detail')} →
          </Link>
          <FavoriteButton id={item.id} kind="news" initialHas={fav} />
        </div>
      </CardContent>
    </Card>
  )
}
