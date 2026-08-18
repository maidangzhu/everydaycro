import type {
  CroItemDraft,
  CroSection,
  CroSourceDraft,
  ExaNewsResult,
} from './types'

export type CroCandidate = {
  section: CroSection
  title: string
  excerpt: string
  sources: CroSourceDraft[]
  quality: number
}

type NewsCluster = {
  representative: ExaNewsResult
  results: ExaNewsResult[]
}

/** 去重 + 事件聚类，产出候选池（先不限制条数，交给 LLM 选干货）。 */
export function buildCandidates(results: ExaNewsResult[]): CroCandidate[] {
  const clusters = clusterResults(dedupeResults(results))
  return clusters
    .map(candidateFromCluster)
    .sort((left, right) => right.quality - left.quality)
}

function candidateFromCluster(cluster: NewsCluster): CroCandidate {
  const result = cluster.representative
  const text = `${result.title} ${result.snippet ?? ''}`
  return {
    section: sectionForResult(result, text),
    title: friendlyTitle(result.title),
    excerpt: compactSentence(result.snippet, 480) || result.title,
    quality: sourceQuality(result),
    sources: cluster.results
      .slice()
      .sort((left, right) => sourceQuality(right) - sourceQuality(left))
      .slice(0, 3)
      .map(sourceFromResult),
  }
}

function sourceFromResult(result: ExaNewsResult) {
  return {
    title: result.title,
    url: result.url,
    ...(result.sourceName ? { publisher: result.sourceName } : {}),
    ...(result.publishedAt ? { publishedAt: result.publishedAt } : {}),
    ...(result.snippet ? { excerpt: compactSentence(result.snippet, 320) } : {}),
  }
}

function dedupeResults(results: ExaNewsResult[]) {
  const seen = new Set<string>()
  return results.filter((result) => {
    const key = normalizeUrl(result.url)
    if (seen.has(key)) return false
    seen.add(key)
    return Boolean(result.title && result.url)
  })
}

function clusterResults(results: ExaNewsResult[]): NewsCluster[] {
  const clusters: NewsCluster[] = []

  for (const result of results) {
    const existing = clusters.find((cluster) => sameEvent(cluster.representative, result))
    if (existing) {
      existing.results.push(result)
      if (sourceQuality(result) > sourceQuality(existing.representative)) {
        existing.representative = {
          ...result,
          searchRoute: existing.representative.searchRoute,
        }
      }
      continue
    }
    clusters.push({ representative: result, results: [result] })
  }

  return clusters
}

function sameEvent(left: ExaNewsResult, right: ExaNewsResult) {
  const leftTokens = eventTokens(left.title)
  const rightTokens = eventTokens(right.title)
  const shared = leftTokens.filter((token) => rightTokens.includes(token))
  if (shared.some(isVersionToken)) return true
  if (shared.length < 2) return false
  const union = new Set([...leftTokens, ...rightTokens]).size
  return shared.length / union >= 0.36
}

function isVersionToken(token: string) {
  return token !== '2026' && (
    /[a-z]/.test(token) && /\d/.test(token)
    || /^\d+\.\d+$/.test(token)
  )
}

const EVENT_STOP_WORDS = new Set([
  'about', 'after', 'announces', 'artificial', 'clinical', 'into', 'intelligence',
  'launch', 'launched', 'launches', 'more', 'news', 'release', 'released', 'says',
  'that', 'their', 'this', 'trial', 'trials', 'with', 'your',
])

function eventTokens(title: string) {
  return friendlyTitle(title)
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !EVENT_STOP_WORDS.has(token))
}

function sourceQuality(result: ExaNewsResult) {
  let hostname = ''
  try {
    hostname = new URL(result.url).hostname.replace(/^www\./, '')
  } catch {
    return 0
  }

  if (matchesHostname(hostname, [
    'fda.gov', 'ema.europa.eu', 'ich.org', 'nature.com', 'science.org', 'nejm.org',
  ])) return 100
  if (matchesHostname(hostname, [
    'fiercebiotech.com', 'fiercepharma.com', 'endpts.com', 'statnews.com',
    'clinicaltrialsarena.com', 'outsourcing-pharma.com', 'pharmavoice.com',
    'biopharmadive.com', 'reuters.com', 'bloomberg.com', 'ft.com',
  ])) return 80
  if (matchesHostname(hostname, ['clinicaltrials.gov', 'x.com', 'twitter.com'])) return 60
  return 40
}

function matchesHostname(hostname: string, domains: string[]) {
  return domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))
}

function normalizeUrl(url: string) {
  try {
    const parsed = new URL(url)
    parsed.hash = ''
    for (const key of Array.from(parsed.searchParams.keys())) {
      const lowerKey = key.toLowerCase()
      if (lowerKey.startsWith('utm_') || lowerKey === 'ref' || lowerKey === 'source') {
        parsed.searchParams.delete(key)
      }
    }
    parsed.searchParams.sort()
    return parsed.toString().replace(/\/$/, '')
  } catch {
    return url.trim()
  }
}

function sectionFor(text: string): CroSection {
  const lower = text.toLowerCase()
  if (matches(lower, [
    'fda', 'ema', 'ich', 'guidance', 'regulation', 'regulator', 'policy', 'draft guidance',
  ])) return 'policy'
  if (matches(lower, ['funding', 'acquisition', 'acquires', 'partnership', 'raises', 'valuation'])) return 'company'
  if (matches(lower, ['platform', 'tool', 'software', 'model', 'llm', 'agent', 'launch', 'copilot'])) return 'tooling'
  return 'trial'
}

function sectionForResult(result: ExaNewsResult, text: string): CroSection {
  if (result.searchRoute === 'policy') return 'policy'
  if (result.searchRoute === 'company') return 'company'
  if (result.searchRoute === 'tooling') return 'tooling'
  if (result.searchRoute === 'trial') return 'trial'
  return sectionFor(text)
}

function matches(value: string, tokens: string[]) {
  return tokens.some((token) => value.includes(token))
}

function friendlyTitle(title: string) {
  return title
    .replace(/\s*\|\s*[^|]+$/g, '')
    .replace(/\s+-\s+[A-Z][A-Za-z ]+(News|Bio|Pharma|Clinical).*$/i, '')
    .trim()
}

function compactSentence(value: string | undefined, maxLength: number) {
  if (!value) return ''
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

export function issueDateFor(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(date)
}

export function issueNumberFor(issueDate: string) {
  const [year, month, day] = issueDate.split('-').map(Number)
  const start = Date.UTC(year, 0, 1)
  const current = Date.UTC(year, month - 1, day)
  return Math.floor((current - start) / 86_400_000) + 1
}

export function itemFromPicked(
  picked: { title: string; summary: string; detail: string; takeaway: string; section: string },
  rank: number,
  sources: CroSourceDraft[],
): CroItemDraft {
  return {
    rank,
    section: (picked.section as CroSection) || 'trial',
    title: picked.title,
    summary: picked.summary,
    detail: picked.detail,
    takeaway: picked.takeaway,
    sources,
  }
}
