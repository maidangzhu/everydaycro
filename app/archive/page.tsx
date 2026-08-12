import Link from 'next/link'
import { listCroIssues } from '@/lib/cro/store'

export const dynamic = 'force-dynamic'

export default async function ArchivePage() {
  const issues = await listCroIssues(30)

  return (
    <div>
      <h1 className="headline" style={{ marginTop: 28 }}>
        归档
      </h1>
      {issues.length === 0 ? (
        <p className="empty">还没有任何一期。</p>
      ) : (
        <ul className="archive-list">
          {issues.map((issue) => {
            const date = new Date(issue.issueDate).toISOString().slice(0, 10)
            return (
              <li key={issue.id}>
                <Link href={`/issue/${date}`}>
                  <span className="archive-headline">{issue.headline}</span>
                  <span className="archive-date">{date}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
