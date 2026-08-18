import Link from 'next/link'
import { getLatestCroIssue } from '@everydaycro/content'
import { LEARNING_PATH } from '@everydaycro/content/learning-path'
import { Card, CardContent } from '@everydaycro/ui'
import { GlossaryCard } from './Glossary'
import { NewsCard } from './components/NewsCard'
import { SectionHead } from './components/SectionHead'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const issue = await getLatestCroIssue()
  const firstWeek = LEARNING_PATH[0]

  return (
    <div className="space-y-10">
      {/* ===== 今日精选 ===== */}
      <section>
        <SectionHead
          title="今日精选"
          sub="海外 CRO × AI 最新动向"
          action={
            <Link href="/archive" className="text-sm text-primary hover:underline">
              归档 →
            </Link>
          }
        />
        {issue ? (
          <div className="grid gap-4 md:grid-cols-2">
            {issue.items.slice(0, 4).map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                issueDate={new Date(issue.issueDate).toISOString().slice(0, 10)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              还没有内容。运行 <code>pnpm generate</code> 或访问{' '}
              <code>/api/generate</code> 生成第一期。
            </CardContent>
          </Card>
        )}
      </section>

      {/* ===== 学习路径钩子 ===== */}
      {firstWeek ? (
        <section>
          <SectionHead title="学习路径" sub="新人 4 周上手 CRO × AI" />
          <Link href="/learn">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <div className="font-semibold">
                    第 {firstWeek.week} 周 · {firstWeek.title}
                  </div>
                  <div className="text-sm text-muted-foreground">{firstWeek.desc}</div>
                </div>
                <span className="text-primary">开始 →</span>
              </CardContent>
            </Card>
          </Link>
        </section>
      ) : null}

      {/* ===== 名词速查 ===== */}
      <section>
        <SectionHead title="名词速查" sub="行业缩写 / 术语，随查随用" />
        <GlossaryCard />
      </section>
    </div>
  )
}
