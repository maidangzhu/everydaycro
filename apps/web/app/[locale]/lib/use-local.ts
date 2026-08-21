'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * 匿名本地存储 hook：学习进度/收藏/打卡统一走这里，
 * 命名空间 everydaycro:*，未来要换成服务端只改这一层。
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const fullKey = `everydaycro:${key}`
  const [value, setValue] = useState<T>(initial)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(fullKey)
      if (raw !== null) setValue(JSON.parse(raw) as T)
    } catch {}
    setLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullKey])

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        try {
          window.localStorage.setItem(fullKey, JSON.stringify(v))
        } catch {}
        return v
      })
    },
    [fullKey],
  )

  return [value, set, loaded] as const
}

/** 收藏集合（按 id 存）。kind 区分 news/post。 */
export function useFavorites(kind: 'news' | 'post') {
  const [ids, setIds, loaded] = useLocalStorage<string[]>(`fav:${kind}`, [])
  const toggle = useCallback(
    (id: string) =>
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setIds],
  )
  const has = useCallback((id: string) => ids.includes(id), [ids])
  return { ids, toggle, has, loaded }
}
