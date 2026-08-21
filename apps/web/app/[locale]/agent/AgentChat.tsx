'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useEveAgent } from 'eve/react'
import { Button } from '@everydaycro/ui'

type ChatMessage = {
  id: string
  role: string
  text: string
}

/**
 * 站内 AI 助手聊天窗口（Medium 风格）。
 * useEveAgent 与 withEve 挂载的同域 /eve/v1/* 通信，cookie 鉴权自动携带。
 */
export function AgentChat() {
  const t = useTranslations('agent')
  const agent = useEveAgent()
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  const isBusy = agent.status === 'submitted' || agent.status === 'streaming'

  const messages: ChatMessage[] = agent.data.messages
    .map((message) => ({
      id: message.id,
      role: message.role,
      text: message.parts
        .filter((part) => part.type === 'text' && part.state !== 'streaming')
        .map((part) => (part as { text: string }).text)
        .join('\n'),
    }))
    .filter((message) => message.text.trim().length > 0)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages.length])

  function send(text: string) {
    const message = text.trim()
    if (!message || isBusy) return
    setInput('')
    void agent.send(message)
  }

  const suggestions = [t('suggestions.s1'), t('suggestions.s2'), t('suggestions.s3'), t('suggestions.s4')]

  return (
    <div className="flex h-[calc(100vh-16rem)] min-h-[28rem] flex-col overflow-hidden rounded-lg border bg-card">
      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl">🤖</div>
            <div className="space-y-2">
              <p className="font-serif text-lg font-semibold">{t('title')}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
            >
              <div
                className={
                  message.role === 'user'
                    ? 'max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground'
                    : 'max-w-[85%] rounded-2xl bg-accent px-4 py-2.5 text-sm leading-relaxed'
                }
              >
                <div className="mb-1 text-xs opacity-60">
                  {message.role === 'user' ? t('you') : t('assistant')}
                </div>
                <div className="whitespace-pre-wrap">{message.text}</div>
              </div>
            </div>
          ))
        )}
        {isBusy ? (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-accent px-4 py-2.5 text-sm text-muted-foreground">
              {t('thinking')}
            </div>
          </div>
        ) : null}
        {agent.status === 'error' ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            {t('error')}
          </div>
        ) : null}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          send(input)
        }}
        className="flex items-center gap-2 border-t px-4 py-3"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t('placeholder')}
          disabled={isBusy}
          className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none transition-colors focus:border-primary disabled:opacity-60"
        />
        {isBusy ? (
          <Button type="button" variant="outline" onClick={() => void agent.cancel()}>
            {t('stop')}
          </Button>
        ) : (
          <Button type="submit" disabled={!input.trim()}>
            {t('send')}
          </Button>
        )}
      </form>
    </div>
  )
}
