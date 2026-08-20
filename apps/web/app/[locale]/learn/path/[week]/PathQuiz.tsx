'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { QuizQuestion } from '@everydaycro/content/quiz'
import { Button, Card, CardContent, Progress } from '@everydaycro/ui'
import { syncWeekProgressAction, awardQuizPointsAction } from '../../../lib/actions'

/**
 * 周路径闯关：逐题作答、即时判分、显示解析。
 * 答对的题 id 存入 localStorage（everydaycro:path:<slug>）驱动进度；
 * 同时调 server action 云端同步（未登录时 action 内部 no-op）。
 */
export function PathQuiz({
  questions,
  weekSlug,
}: {
  questions: QuizQuestion[]
  weekSlug: string
}) {
  const t = useTranslations('quiz')
  const [current, setCurrent] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)

  const question = questions[current]
  const answered = picked !== null
  const isLast = current === questions.length - 1
  const total = questions.length

  function markCorrect(id: string) {
    try {
      const key = `everydaycro:path:${weekSlug}`
      const raw = window.localStorage.getItem(key)
      const ids: string[] = raw ? JSON.parse(raw) : []
      if (!ids.includes(id)) {
        ids.push(id)
        window.localStorage.setItem(key, JSON.stringify(ids))
      }
      // 云端同步（登录用户）+ 答题积分
      void syncWeekProgressAction(weekSlug, ids)
      void awardQuizPointsAction(id)
      return ids
    } catch {
      return null
    }
  }

  function choose(index: number) {
    if (answered) return
    setPicked(index)
    if (index === question.answerIndex) {
      setCorrectCount((c) => c + 1)
      markCorrect(question.id)
    }
  }

  function next() {
    setPicked(null)
    if (isLast) setDone(true)
    else setCurrent((c) => c + 1)
  }

  function restart() {
    setCurrent(0)
    setPicked(null)
    setCorrectCount(0)
    setDone(false)
  }

  if (!question) return null

  if (done) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="mb-2 text-4xl">
            {correctCount === total ? '🏆' : correctCount >= total / 2 ? '💪' : '📖'}
          </div>
          <div className="mb-1 font-serif text-3xl font-bold">
            {correctCount} / {total}
          </div>
          <p className="mb-4 text-sm text-muted-foreground">{t('resultSub')}</p>
          <Button onClick={restart} className="rounded-full">
            {t('again')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="rounded bg-secondary px-2 py-0.5 text-secondary-foreground">
            {question.category}
          </span>
          <span className="text-muted-foreground">
            {current + 1} / {total}
          </span>
        </div>
        <Progress value={((current + 1) / total) * 100} className="mb-4" />

        <h3 className="mb-4 font-serif text-xl font-semibold">{question.question}</h3>

        <div className="space-y-2">
          {question.options.map((option, index) => {
            let cls = 'border-input hover:border-primary'
            if (answered) {
              if (index === question.answerIndex) cls = 'border-primary bg-primary/10'
              else if (index === picked) cls = 'border-destructive bg-destructive/10'
              else cls = 'border-input opacity-60'
            }
            return (
              <button
                key={index}
                onClick={() => choose(index)}
                disabled={answered}
                className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${cls}`}
              >
                <span>{option}</span>
                {answered && index === question.answerIndex ? (
                  <span className="text-primary">✓</span>
                ) : null}
                {answered && index === picked && index !== question.answerIndex ? (
                  <span className="text-destructive">✕</span>
                ) : null}
              </button>
            )
          })}
        </div>

        {answered ? (
          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-1 text-sm font-semibold">
              {picked === question.answerIndex ? t('correct') : t('wrong')}
            </p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
            <Button className="mt-3 rounded-full" onClick={next}>
              {isLast ? t('result') : t('next')}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
