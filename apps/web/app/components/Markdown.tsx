import React from 'react'

/**
 * 极简 Markdown 渲染：标题/加粗/斜体/列表/段落/链接。
 * 专栏正文由受控 prompt 生成，结构简单，无需引重依赖。
 */
export function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/)
  return (
    <div className="space-y-4 leading-relaxed">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  )
}

function renderBlock(block: string, key: number): React.ReactNode {
  const trimmed = block.trim()
  if (!trimmed) return null

  const h = trimmed.match(/^(#{1,4})\s+(.*)$/)
  if (h) {
    const level = h[1].length
    const content = inline(h[2])
    const cls =
      level === 1
        ? 'text-2xl font-bold'
        : level === 2
          ? 'text-xl font-bold'
          : 'text-lg font-semibold'
    return (
      <div key={key} className={cls}>
        {content}
      </div>
    )
  }

  const lines = trimmed.split('\n')
  if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
    return (
      <ul key={key} className="list-disc space-y-1 pl-6">
        {lines.map((l, j) => (
          <li key={j}>{inline(l.replace(/^\s*[-*]\s+/, ''))}</li>
        ))}
      </ul>
    )
  }
  if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
    return (
      <ol key={key} className="list-decimal space-y-1 pl-6">
        {lines.map((l, j) => (
          <li key={j}>{inline(l.replace(/^\s*\d+\.\s+/, ''))}</li>
        ))}
      </ol>
    )
  }

  return <p key={key}>{inline(trimmed)}</p>
}

function inline(text: string): React.ReactNode[] {
  // 链接 [t](u)、加粗 **x**、斜体 *x*、行内码 `x`
  const pattern = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  const out: React.ReactNode[] = []
  let last = 0
  let key = 0
  for (const m of text.matchAll(pattern)) {
    const i = m.index ?? 0
    if (i > last) out.push(text.slice(last, i))
    const tok = m[0]
    if (tok.startsWith('[')) {
      const mm = tok.match(/\[([^\]]+)\]\(([^)]+)\)/)
      out.push(
        <a
          key={key++}
          href={mm?.[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          {mm?.[1]}
        </a>,
      )
    } else if (tok.startsWith('**')) {
      out.push(<strong key={key++}>{tok.slice(2, -2)}</strong>)
    } else if (tok.startsWith('`')) {
      out.push(
        <code key={key++} className="rounded bg-muted px-1 font-mono text-sm">
          {tok.slice(1, -1)}
        </code>,
      )
    } else {
      out.push(<em key={key++}>{tok.slice(1, -1)}</em>)
    }
    last = i + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}
