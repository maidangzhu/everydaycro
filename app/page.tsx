import { getLatestCroIssue } from '@/lib/cro/store'
import { pickDailyQuestions, pickDailyAbbreviations } from '@/lib/quiz'
import { IssueView } from './IssueView'
import { DailyQuiz } from './Quiz'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const issue = await getLatestCroIssue()
  const today = new Date().toISOString().slice(0, 10)
  const questions = pickDailyQuestions(today, 8)
  const abbrQuestions = pickDailyAbbreviations(today, 6)

  return (
    <>
      {issue ? (
        <IssueView issue={issue} />
      ) : (
        <div className="empty">
          <p>还没有内容。</p>
          <p>
            运行 <code>pnpm generate</code> 或访问 <code>/api/generate</code> 生成第一期。
          </p>
        </div>
      )}

      <section className="quiz-section">
        <div className="issue-meta">每日一练 · CRO 行业知识</div>
        <DailyQuiz questions={questions} dateISO={today} variant="daily" />
      </section>

      <section className="quiz-section">
        <div className="issue-meta">缩写速记 · 行业名词大闯关</div>
        <DailyQuiz questions={abbrQuestions} dateISO={today} variant="abbr" />
      </section>
    </>
  )
}
