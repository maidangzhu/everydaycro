import Link from 'next/link'
import { GLOSSARY } from '@everydaycro/content/quiz'

/**
 * 把正文里命中的行业名词渲染为可点锚点，点击跳名词速查（携带查询词）。
 * 命中规则：GLOSSARY 的 abbr（如 CRO、CRA）与中文 zh（如 合同研究组织）。
 * 为避免误伤，仅匹配常见缩写与大写词，且整段文本一次性切分。
 */
export function GlossaryText({ text, className }: { text: string; className?: string }) {
  const nodes = linkify(text)
  return <span className={className}>{nodes}</span>
}

function linkify(text: string): React.ReactNode[] {
  // 取 abbr（>=2 字符）与 zh（>=2 字）作为命中词，长词优先，避免子串先匹配
  const terms = GLOSSARY.flatMap((t) => [t.abbr, t.zh])
    .filter((w) => w && w.length >= 2)
    .sort((a, b) => b.length - a.length)
  if (terms.length === 0) return [text]

  // 中英混排时 \b 会失效（中文也是 \w），改用自造边界：缩写前后不能是英文字母/数字。
  // 中文词直接匹配。
  const pattern = new RegExp(
    `(${terms
      .map((w) =>
        /^[A-Z0-9]+$/.test(w)
          ? `(?<![A-Za-z0-9])${escapeReg(w)}(?![A-Za-z0-9])`
          : escapeReg(w),
      )
      .join('|')})`,
    'g',
  )

  const out: React.ReactNode[] = []
  let last = 0
  let key = 0
  for (const m of text.matchAll(pattern)) {
    const i = m.index ?? 0
    if (i > last) out.push(text.slice(last, i))
    const word = m[0]
    out.push(
      <Link
        key={key++}
        href={`/learn/glossary?q=${encodeURIComponent(word)}`}
        className="glossary-link"
        title="查看名词"
      >
        {word}
      </Link>,
    )
    last = i + word.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
