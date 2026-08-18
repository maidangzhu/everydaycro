'use client'

import { useEffect, useMemo, useState } from 'react'
import { GLOSSARY, searchGlossary } from '@everydaycro/content/quiz'
import { Input } from '@everydaycro/ui'

export function GlossaryCard({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const results = useMemo(() => searchGlossary(query), [query])

  return (
    <div>
      <div className="relative mb-3">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          🔍
        </span>
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜缩写 / 英文 / 中文，如 CRA、监查员、EDC…"
          aria-label="查询名词"
          className="pl-9"
        />
        {query ? (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setQuery('')}
            aria-label="清空"
          >
            ✕
          </button>
        ) : null}
      </div>

      <div className="mb-2 text-xs text-muted-foreground">
        {query ? `${results.length} 个结果` : `共 ${GLOSSARY.length} 个名词`}
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {results.length === 0 ? (
          <li className="text-sm text-muted-foreground">
            没查到「{query}」，试试别的写法。
          </li>
        ) : (
          results.map((t) => (
            <li key={t.abbr} className="rounded-lg border bg-card p-3">
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-semibold text-primary">{t.abbr}</span>
                <span className="text-sm">{t.zh}</span>
              </div>
              <div className="text-xs text-muted-foreground">{t.full}</div>
              <div className="mt-1 text-sm text-muted-foreground">{t.note}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
