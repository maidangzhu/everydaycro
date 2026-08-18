'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, Progress } from '@everydaycro/ui'
import type { LearningWeek } from '@everydaycro/content/learning-path'

/**
 * 每周进度卡：读 localStorage 里该周已答对的题 id 集合，算完成度。
 * key: everydaycro:path:<slug> -> string[]（已答对题 id）
 */
export function WeekProgressCard({ week }: { week: LearningWeek & { total: number } }) {
  const [done, setDone] = useState(0)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`everydaycro:path:${week.slug}`)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setDone(ids.length)
    } catch {}
  }, [week.slug])

  const pct = week.total > 0 ? Math.round((done / week.total) * 100) : 0

  return (
    <Link href={`/learn/path/${week.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-primary">第 {week.week} 周</span>
            <span className="text-xs text-muted-foreground">
              {done}/{week.total}
            </span>
          </div>
          <div className="mb-1 font-semibold">{week.title}</div>
          <p className="mb-3 text-sm text-muted-foreground">{week.desc}</p>
          <Progress value={pct} />
        </CardContent>
      </Card>
    </Link>
  )
}
