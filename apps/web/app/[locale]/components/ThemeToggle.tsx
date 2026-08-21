'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@everydaycro/ui'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <Button variant="ghost" size="icon" aria-label="切换主题" />
  const dark = theme === 'dark'
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="切换主题"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      {dark ? '🌙' : '☀️'}
    </Button>
  )
}
