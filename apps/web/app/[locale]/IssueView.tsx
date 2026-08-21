import { getTranslations } from 'next-intl/server'
import type { CroIssueRecord } from '@everydaycro/content'
import { Badge } from '@everydaycro/ui'
import { NewsCard } from './components/NewsCard'
import { FavoriteButton } from './components/FavoriteButton'
import { GlossaryText } from './components/GlossaryText'

type Item = CroIssueRecord['items'][number]

/** 期整体视图：头条 + 各条卡片（摘要），用于 /issue/[date]。 */
export async function IssueView({
  issue,
  favIds,
}: {
  issue: CroIssueRecord
  favIds?: Set<string>
}) {
  const t = await getTranslations('news')
  const date = new Date(issue.issueDate).toISOString().slice(0, 10)
  return (
    <article>
      <div className="mb-1 text-sm text-muted-foreground">
        {t('issueMeta', { n: issue.issueNumber, date, count: issue.items.length })}
      </div>
      <h1 className="mb-2 font-serif text-4xl font-bold leading-tight tracking-tight">
        {issue.headline}
      </h1>
      <p className="mb-6 text-lg text-muted-foreground">{issue.dek}</p>

      <div className="grid gap-4">
        {issue.items.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            issueDate={date}
            fav={favIds?.has(item.id)}
          />
        ))}
      </div>
    </article>
  )
}

/** 单条详情视图：/issue/[date]/[rank]。含 detail、takeaway、来源、名词联动、收藏。 */
export async function NewsItemDetail({
  item,
  issueDate,
  fav,
}: {
  item: Item
  issueDate: string
  fav?: boolean
}) {
  const [t, tSec] = await Promise.all([getTranslations('news'), getTranslations('sections')])
  return (
    <article className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center gap-2">
        <Badge variant="secondary">{tSec(item.section)}</Badge>
        <span className="text-sm text-muted-foreground">
          {new Date(issueDate).toISOString().slice(0, 10)}
        </span>
      </div>
      <h1 className="mb-3 font-serif text-3xl font-bold leading-tight">{item.title}</h1>
      <p className="mb-4 text-lg text-muted-foreground">
        <GlossaryText text={item.summary} />
      </p>

      <div className="mb-4 text-base leading-relaxed">
        <GlossaryText text={item.detail} />
      </div>

      {item.takeaway ? (
        <div className="mb-6 rounded-lg border-l-4 border-primary bg-accent/50 p-4">
          <div className="mb-1 text-xs font-semibold text-primary">{t('takeaway')}</div>
          <GlossaryText text={item.takeaway} />
        </div>
      ) : null}

      {item.sources.length > 0 ? (
        <div className="mb-6">
          <div className="mb-2 text-sm font-semibold text-muted-foreground">{t('sources')}</div>
          <ul className="space-y-1">
            {item.sources.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {s.publisher ?? s.title ?? t('viewSource')} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <FavoriteButton id={item.id} kind="news" initialHas={fav} />
    </article>
  )
}
