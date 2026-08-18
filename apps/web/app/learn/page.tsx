import {
  LEARNING_PATH,
  getWeekQuestions,
} from '@everydaycro/content/learning-path'
import { SectionHead } from '../components/SectionHead'
import { WeekProgressCard } from './WeekProgressCard'
import { GlossaryCard } from '../Glossary'

export const metadata = { title: '学习中心' }

export default function LearnPage() {
  return (
    <div className="space-y-10">
      <section>
        <SectionHead title="学习路径" sub="新人 4 周上手 CRO × AI，按周闯关" />
        <div className="grid gap-4 sm:grid-cols-2">
          {LEARNING_PATH.map((week) => (
            <WeekProgressCard
              key={week.slug}
              week={{ ...week, total: getWeekQuestions(week.slug).length }}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHead title="名词速查" sub="行业缩写 / 术语，随查随用" />
        <GlossaryCard />
      </section>
    </div>
  )
}
