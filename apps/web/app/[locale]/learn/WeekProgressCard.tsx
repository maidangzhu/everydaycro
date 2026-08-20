'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Card, CardContent, Progress } from '@everydaycro/ui'
import type { LearningWeek } from '@everydaycro/content/learning-path'

/**
 * 每周进度卡：本地 localStorage 与云端（initialDone，登录用户提供）取较大值。
 * key: everydaycro:path:<slug> -> string[]（已答对题 id）
 */
export function WeekProgressCard({
  week,
  initialDone,
}: {
  week: LearningWeek & { total: number }
  initialDone?: number
}) {
  const t = useTranslations('home')
  const [done, setDone] = useState(initialDone ?? 0)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`everydaycro:path:${week.slug}`)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setDone((prev) => Math.max(prev, ids.length))
    } catch {}
  }, [week.slug])

  const pct = week.total > 0 ? Math.min(100, Math.round((done / week.total) * 100)) : 0

  return (
    <Link href={`/learn/path/${week.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-primary">
              {t('weekN', { week: week.week })}
            </span>
            <span className="text-xs text-muted-foreground">
              {done}/{week.total}
            </span>
          </div>
          <div className="mb-1 font-serif text-lg font-semibold">{week.title}</div>
          <p className="mb-3 text-sm text-muted-foreground">{week.desc}</p>
          <Progress value={pct} />
        </CardContent>
      </Card>
    </Link>
  )
}
