'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@everydaycro/ui'
import { useFavorites } from '../lib/use-local'
import { toggleFavoriteAction } from '../lib/actions'

/**
 * 收藏按钮（登录 + 匿名双模式）：
 * - 匿名：只写 localStorage
 * - 登录：initialHas 由服务端给出，本地镜像 + toggleFavoriteAction 同步云端
 */
export function FavoriteButton({
  id,
  kind,
  initialHas,
}: {
  id: string
  kind: 'news' | 'post'
  initialHas?: boolean
}) {
  const t = useTranslations('favorite')
  const { has, toggle, loaded } = useFavorites(kind)

  // 服务端已知收藏而本地缺失（换设备登录）→ 同步进本地镜像
  useEffect(() => {
    if (initialHas && loaded && !has(id)) toggle(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialHas, loaded])

  const active = loaded ? has(id) : Boolean(initialHas)

  function onToggle() {
    toggle(id)
    // 服务端同步（未登录时 action 内部直接 no-op）
    void toggleFavoriteAction(kind, id, !active)
  }

  return (
    <Button
      variant={active ? 'secondary' : 'outline'}
      size="sm"
      onClick={onToggle}
      aria-pressed={active}
    >
      {active ? t('added') : t('add')}
    </Button>
  )
}
