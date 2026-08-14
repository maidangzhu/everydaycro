'use client'

import { useEffect, useRef, useState } from 'react'
import type { QuizQuestion } from '@/lib/quiz'

type Props = {
  questions: QuizQuestion[]
  dateISO: string
  /** 用于区分不同板块的本存档 key（daily / abbr 等） */
  variant?: string
}

// ---- 增幅器（Jokers）----
type Relic = {
  id: string
  name: string
  emoji: string
  desc: string
}

const RELIC_POOL: Relic[] = [
  { id: 'gcp', name: 'GCP 认证', emoji: '📜', desc: '所有得分 ×1.5' },
  { id: 'speed', name: '黄金手速', emoji: '⚡', desc: '10 秒内答对 ×2' },
  { id: 'streak', name: '稳如老狗', emoji: '🐶', desc: '每连对 1 题倍率 +1' },
  { id: 'data', name: '数据爆炸', emoji: '💥', desc: '底分 ×2' },
  { id: 'recruit', name: '招募达人', emoji: '🎯', desc: '答对额外 +150 底分' },
  { id: 'ai', name: 'AI 加持', emoji: '🤖', desc: '倍率 ×1.5（向上取整）' },
]

type Popup = {
  id: number
  text: string
  kind: 'score' | 'mult' | 'relic'
}

const BASE_SCORE = 100
const FAST_MS = 10_000

export function DailyQuiz({ questions, dateISO, variant = 'daily' }: Props) {
  const [current, setCurrent] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  // 数值引擎
  const [chips, setChips] = useState(0)          // 累计得分
  const [displayChips, setDisplayChips] = useState(0) // 滚动显示
  const [mult, setMult] = useState(1)            // 当前倍率
  const [streak, setStreak] = useState(0)        // 连对
  const [relics, setRelics] = useState<Relic[]>([])
  const [pendingRelic, setPendingRelic] = useState<Relic | null>(null) // 待抽取

  const [popups, setPopups] = useState<Popup[]>([])
  const [shake, setShake] = useState(false)
  const [flash, setFlash] = useState<'ok' | 'no' | null>(null)
  const questionStart = useRef<number>(Date.now())
  const popupId = useRef(0)

  const question = questions[current]
  const answered = picked !== null
  const isLast = current === questions.length - 1

  // 底分滚动动画（Odometer）
  useEffect(() => {
    if (displayChips === chips) return
    const diff = chips - displayChips
    const step = Math.max(1, Math.round(Math.abs(diff) / 12))
    const t = setTimeout(() => {
      setDisplayChips((d) => (d < chips ? Math.min(chips, d + step) : chips))
    }, 30)
    return () => clearTimeout(t)
  }, [chips, displayChips])

  function pushPopup(text: string, kind: Popup['kind']) {
    const id = ++popupId.current
    setPopups((p) => [...p, { id, text, kind }])
    setTimeout(() => setPopups((p) => p.filter((x) => x.id !== id)), 1200)
  }

  function hasRelic(id: string) {
    return relics.some((r) => r.id === id)
  }

  function computeGain(): { gain: number; fast: boolean } {
    const fast = Date.now() - questionStart.current < FAST_MS
    let base = BASE_SCORE
    if (hasRelic('data')) base *= 2
    if (hasRelic('recruit')) base += 150
    if (fast) base += 50

    let m = mult
    if (hasRelic('gcp')) m = Math.round(m * 1.5 * 10) / 10
    if (fast && hasRelic('speed')) m *= 2
    if (hasRelic('ai')) m = Math.ceil(m * 1.5)

    return { gain: Math.round(base * m), fast }
  }

  function choose(index: number) {
    if (answered || pendingRelic) return
    setPicked(index)

    const correct = index === question.answerIndex
    if (correct) {
      const { gain, fast } = computeGain()
      const newStreak = streak + 1
      setStreak(newStreak)

      // 倍率成长：基础 +1，稳如老狗再 +1
      let multGain = 1
      if (hasRelic('streak')) multGain += 1
      const newMult = mult + multGain

      // 数值爆炸演出
      setChips((c) => c + gain)
      pushPopup(`+${gain}`, 'score')
      if (newMult > mult) pushPopup(`倍率 ×${newMult}`, 'mult')
      if (fast) pushPopup('⚡ 快答!', 'mult')
      if (newStreak >= 3) pushPopup(`🔥 ${newStreak} 连对!`, 'mult')

      setMult(newMult)
      setFlash('ok')
      setShake(gain >= 400 || newStreak >= 3)
      setTimeout(() => setShake(false), 500)
      setTimeout(() => setFlash(null), 400)

      // 每答对 2 题抽一张增幅器
      if (shouldOfferRelic()) {
        offerRelic()
      }
    } else {
      // 答错：倍率清零，连招断
      setMult(1)
      setStreak(0)
      pushPopup('倍率重置', 'mult')
      setFlash('no')
      setTimeout(() => setFlash(null), 400)
    }
  }

  const relicOfferCounter = useRef(0)
  function shouldOfferRelic() {
    // 每答对 2 题给一次抽卡机会，最多 4 张
    relicOfferCounter.current += 1
    return relicOfferCounter.current % 2 === 0 && relics.length < 4
  }

  function offerRelic() {
    const available = RELIC_POOL.filter((r) => !relics.some((x) => x.id === r.id))
    if (available.length === 0) return
    // 用 dateISO + relics.length 做确定性"随机"
    const seed = (dateISO.length * 7 + relics.length * 13 + streak) % available.length
    setPendingRelic(available[seed])
  }

  function takeRelic() {
    if (!pendingRelic) return
    setRelics((r) => [...r, pendingRelic])
    pushPopup(`${pendingRelic.emoji} ${pendingRelic.name}`, 'relic')
    setPendingRelic(null)
  }

  function next() {
    setPicked(null)
    questionStart.current = Date.now()
    if (isLast) {
      persistDay()
      setDone(true)
    } else {
      setCurrent((c) => c + 1)
    }
  }

  // 答对后自动进入下一题（若有抽卡，等收卡后再走）；答错仍需手动点
  useEffect(() => {
    if (!answered || pendingRelic) return
    if (picked !== question.answerIndex) return
    const t = setTimeout(next, 900)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, picked, pendingRelic, current])

  const K = {
    last: `cro-quiz-${variant}-last`,
    streak: `cro-quiz-${variant}-streak`,
    best: `cro-quiz-${variant}-best`,
  }

  function persistDay() {
    try {
      const today = dateISO
      const last = window.localStorage.getItem(K.last)
      const prev = Number(window.localStorage.getItem(K.streak) ?? 0)
      if (last !== today) {
        const yesterday = new Date(new Date(today).getTime() - 86400000).toISOString().slice(0, 10)
        const nextStreak = last === yesterday ? prev + 1 : 1
        window.localStorage.setItem(K.streak, String(nextStreak))
        window.localStorage.setItem(K.last, today)
      }
      const best = Number(window.localStorage.getItem(K.best) ?? 0)
      if (chips > best) window.localStorage.setItem(K.best, String(chips))
    } catch {}
  }

  function restart() {
    setCurrent(0)
    setPicked(null)
    setDone(false)
    setChips(0)
    setDisplayChips(0)
    setMult(1)
    setStreak(0)
    setRelics([])
    setPendingRelic(null)
    relicOfferCounter.current = 0
    questionStart.current = Date.now()
  }

  if (!question) return null

  // ---- 结算页 ----
  if (done) {
    const best = typeof window !== 'undefined'
      ? Number(window.localStorage.getItem(K.best) ?? 0)
      : 0
    const dayStreak = typeof window !== 'undefined'
      ? Number(window.localStorage.getItem(K.streak) ?? 0)
      : 0
    return (
      <div className="quiz-card result">
        <div className="quiz-emoji">{chips >= 1500 ? '🏆' : chips >= 600 ? '💥' : '📖'}</div>
        <div className="final-score">{displayChips.toLocaleString()}</div>
        <div className="final-label">总分</div>
        <div className="final-stats">
          <span>最高倍率 ×{mult}</span>
          <span>·</span>
          <span>{relics.length} 张增幅器</span>
          <span>·</span>
          <span>连续学习 {dayStreak} 天 🔥</span>
        </div>
        {chips >= best && chips > 0 && <div className="new-best">新纪录！</div>}
        <button className="quiz-btn" onClick={restart}>再来一轮</button>
      </div>
    )
  }

  return (
    <div className={`quiz-arena ${shake ? 'shake' : ''} ${flash ? `flash-${flash}` : ''}`}>
      {/* HUD */}
      <div className="hud">
        <div className="hud-score">
          <div className="hud-num">{displayChips.toLocaleString()}</div>
          <div className="hud-cap">得分</div>
        </div>
        <div className="hud-mult">
          <div className="hud-num mult">×{mult}</div>
          <div className="hud-cap">倍率</div>
        </div>
        <div className="hud-streak">
          <div className="hud-num">{streak > 0 ? `🔥${streak}` : '—'}</div>
          <div className="hud-cap">连对</div>
        </div>
      </div>

      {/* 增幅器栏 */}
      {relics.length > 0 && (
        <div className="relic-bar">
          {relics.map((r) => (
            <span key={r.id} className="relic" title={`${r.name}：${r.desc}`}>
              {r.emoji}
            </span>
          ))}
        </div>
      )}

      {/* 弹层：抽增幅器 */}
      {pendingRelic && (
        <div className="relic-draw">
          <div className="relic-draw-card">
            <div className="relic-draw-emoji">{pendingRelic.emoji}</div>
            <div className="relic-draw-name">{pendingRelic.name}</div>
            <div className="relic-draw-desc">{pendingRelic.desc}</div>
            <button className="quiz-btn" onClick={takeRelic}>收入囊中</button>
          </div>
        </div>
      )}

      <div className="quiz-card">
        <div className="quiz-top">
          <span className="chip">{question.category}</span>
          <span className="quiz-progress">{current + 1} / {questions.length}</span>
        </div>

        <h3 className="quiz-question">{question.question}</h3>

        <div className="quiz-options">
          {question.options.map((option, index) => {
            let cls = ''
            if (answered) {
              if (index === question.answerIndex) cls = 'correct'
              else if (index === picked) cls = 'wrong'
            }
            return (
              <button
                key={index}
                className={`quiz-option ${cls} ${answered ? 'locked' : ''}`}
                onClick={() => choose(index)}
              >
                <span className="quiz-option-text">{option}</span>
                {cls === 'correct' && <span className="quiz-mark">✓</span>}
                {cls === 'wrong' && <span className="quiz-mark">✕</span>}
              </button>
            )
          })}
        </div>

        {answered && !pendingRelic && (
          <div className={`quiz-explain ${picked === question.answerIndex ? 'ok' : 'no'}`}>
            <p className="quiz-explain-head">
              {picked === question.answerIndex ? '答对了，自动进入下一题…' : '正确答案已标出'}
            </p>
            <p>{question.explanation}</p>
            {picked !== question.answerIndex && (
              <button className="quiz-btn" onClick={next}>
                {isLast ? '查看结果' : '下一题'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 飘出的数值爆炸 */}
      <div className="popup-layer">
        {popups.map((p) => (
          <div key={p.id} className={`popup popup-${p.kind}`}>{p.text}</div>
        ))}
      </div>
    </div>
  )
}
