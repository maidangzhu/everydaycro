import type { CroIssueRecord } from '@/lib/cro/store'

const SECTION_LABEL: Record<string, string> = {
  lead: '头版',
  trial: '临床试验',
  tooling: '工具',
  company: '公司',
  policy: '监管',
}

export function IssueView({ issue }: { issue: CroIssueRecord }) {
  return (
    <article>
      <div className="issue-meta">
        第 {issue.issueNumber} 期 · {formatDate(issue.issueDate)} · 精选 {issue.items.length} 条
      </div>
      <h1 className="headline">{issue.headline}</h1>
      <p className="dek">{issue.dek}</p>

      {issue.items.map((item) => (
        <section className="item" key={item.id}>
          <div className="item-head">
            <span className="rank">{String(item.rank).padStart(2, '0')}</span>
            <span className="chip">{SECTION_LABEL[item.section] ?? item.section}</span>
          </div>
          <h2>{item.title}</h2>
          <p className="summary">{item.summary}</p>
          <p className="detail">{item.detail}</p>
          <p className="takeaway">判断 · {item.takeaway}</p>
          <div className="sources">
            <span>来源</span>
            {item.sources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.publisher ?? '查看'}
              </a>
            ))}
          </div>
        </section>
      ))}
    </article>
  )
}

function formatDate(date: Date) {
  return new Date(date).toISOString().slice(0, 10)
}
