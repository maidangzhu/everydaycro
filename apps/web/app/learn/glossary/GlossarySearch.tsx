'use client'

import { useSearchParams } from 'next/navigation'
import { GlossaryCard } from '../../Glossary'

/** 读 ?q= 作为初始查询词（资讯正文名词联动跳到这里）。 */
export function GlossarySearch() {
  const params = useSearchParams()
  const q = params.get('q') ?? ''
  return <GlossaryCard initialQuery={q} />
}
