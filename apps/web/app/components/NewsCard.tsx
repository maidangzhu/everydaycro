import type { CroIssueRecord } from '@everydaycro/content'
import { Badge, Card, CardContent } from '@everydaycro/ui'
import { FavoriteButton } from './FavoriteButton'
import { GlossaryText } from './GlossaryText'

const SECTION_LABEL: Record<string, string> = {
  lead: '头版',
  trial: '临床试验',
  tooling: '工具',
  company: '公司',
  policy: '监管',
  voice: '大佬观点',
}

type Item = CroIssueRecord['items'][number]

/** 单条资讯卡片：摘要视图（首页/期列表用），可点进详情。 */
export function NewsCard({
  item,
  issueDate,
}: {
  item: Item
  issueDate: string
}) {
  const date = new Date(issueDate).toISOString().slice(0, 10)
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">
            {String(item.rank).padStart(2, '0')}
          </span>
          <Badge variant="secondary">{SECTION_LABEL[item.section] ?? item.section}</Badge>
        </div>
        <a href={`/issue/${date}/${item.rank}`} className="block">
          <h3 className="mb-1 text-base font-semibold leading-snug hover:text-primary">
            {item.title}
          </h3>
        </a>
        <p className="mb-3 text-sm text-muted-foreground">
          <GlossaryText text={item.summary} />
        </p>
        <div className="flex items-center justify-between">
          <a
            href={`/issue/${date}/${item.rank}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            看详情 →
          </a>
          <FavoriteButton id={item.id} kind="news" />
        </div>
      </CardContent>
    </Card>
  )
}

export { SECTION_LABEL }
