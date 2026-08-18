'use client'

import { Button } from '@everydaycro/ui'
import { useFavorites } from '../lib/use-local'

export function FavoriteButton({ id, kind }: { id: string; kind: 'news' | 'post' }) {
  const { has, toggle, loaded } = useFavorites(kind)
  const active = loaded && has(id)
  return (
    <Button
      variant={active ? 'secondary' : 'outline'}
      size="sm"
      onClick={() => toggle(id)}
      aria-pressed={active}
    >
      {active ? '★ 已收藏' : '☆ 收藏'}
    </Button>
  )
}
