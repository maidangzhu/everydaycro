import type { CroSearchRoute, ExaNewsResult } from './types'

export type ExaNewsTransport = (url: string, init: RequestInit) => Promise<Response>

type ExaSearchResponse = {
  results?: Array<{
    title?: string
    url?: string
    highlights?: string[]
    summary?: string
    text?: string
    publishedDate?: string
    author?: string
  }>
}

export const CRO_SEARCH_ROUTES: ReadonlyArray<{
  id: CroSearchRoute
  query: string
  limit: number
  category?: 'news'
}> = [
  {
    id: 'lead',
    query: 'Most consequential news from the past 7 days about artificial intelligence being applied to clinical research or clinical trials, especially work by contract research organizations (CROs) or pharma sponsors using AI. Prioritize original announcements and major reporting. Find distinct events.',
    limit: 6,
    category: 'news',
  },
  {
    id: 'trial',
    query: 'How AI is being used in the past 7 days for clinical trial design, patient recruitment, site selection, protocol optimization, or decentralized clinical trials. Prefer concrete trial examples, pharma or CRO partnerships. Find distinct events.',
    limit: 6,
    category: 'news',
  },
  {
    id: 'tooling',
    query: 'New AI tools, platforms or models released or discussed in the past 7 days for clinical data management, biostatistics, medical writing, pharmacovigilance, regulatory submissions, or clinical data analysis. Include startups and open source. Find distinct products.',
    limit: 7,
  },
  {
    id: 'company',
    query: 'Business moves in the past 7 days involving AI in clinical research: CRO acquisitions, funding rounds, partnerships between AI companies and CROs or pharma, or new AI clinical research companies. Prefer well sourced reporting. Find distinct events.',
    limit: 5,
    category: 'news',
  },
  {
    id: 'policy',
    query: 'Regulatory or policy developments from the past 7 days affecting AI use in clinical trials and drug development, such as FDA, EMA or ICH guidance on AI/ML in clinical research. Prefer consequential and well sourced events. Find distinct topics.',
    limit: 5,
    category: 'news',
  },
]

export async function searchCroNewsRoutesWithExa({
  apiKey,
  lookbackDays = 7,
  transport = fetch,
  now = new Date(),
}: {
  apiKey: string
  lookbackDays?: number
  transport?: ExaNewsTransport
  now?: Date
}): Promise<ExaNewsResult[]> {
  const routeResults = await Promise.all(
    CRO_SEARCH_ROUTES.map(async (route) =>
      searchCroNewsWithExa({
        apiKey,
        query: route.query,
        limit: route.limit,
        category: route.category ?? null,
        lookbackDays,
        searchRoute: route.id,
        transport,
        now,
      }),
    ),
  )

  return routeResults.flat()
}

export async function searchCroNewsWithExa({
  apiKey,
  query,
  limit = 10,
  category = 'news',
  lookbackDays = 7,
  searchRoute,
  transport = fetch,
  now = new Date(),
}: {
  apiKey: string
  query: string
  limit?: number
  category?: 'news' | null
  lookbackDays?: number
  searchRoute?: CroSearchRoute
  transport?: ExaNewsTransport
  now?: Date
}): Promise<ExaNewsResult[]> {
  const trimmedKey = apiKey.trim()
  if (!trimmedKey) throw new Error('EXA_API_KEY is required')

  const response = await transport('https://api.exa.ai/search', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-api-key': trimmedKey,
    },
    body: JSON.stringify({
      query,
      numResults: clampLimit(limit),
      type: 'auto',
      ...(category ? { category } : {}),
      startPublishedDate: isoDaysAgo(now, lookbackDays),
      contents: {
        highlights: true,
        summary: true,
      },
    }),
  })

  const body = (await response.json().catch(() => ({}))) as ExaSearchResponse
  if (!response.ok) {
    throw new Error(`Exa search failed: ${response.status}`)
  }

  return normalizeExaResponse(body)
    .map((result) => ({ ...result, ...(searchRoute ? { searchRoute } : {}) }))
    .slice(0, clampLimit(limit))
}

export function normalizeExaResponse(body: ExaSearchResponse): ExaNewsResult[] {
  return (body.results ?? [])
    .map<ExaNewsResult | null>((item) => {
      if (!item.title || !item.url) return null
      const snippet = item.summary
        || item.highlights?.find((highlight) => highlight.trim())
        || item.text
      return {
        title: item.title,
        url: item.url,
        ...(snippet ? { snippet: snippet.trim() } : {}),
        sourceName: publisherFromUrl(item.url),
        ...(item.publishedDate ? { publishedAt: item.publishedDate } : {}),
      }
    })
    .filter((item): item is ExaNewsResult => Boolean(item))
}

function publisherFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return '来源网站'
  }
}

function clampLimit(limit: number) {
  if (!Number.isInteger(limit)) return 10
  return Math.min(Math.max(limit, 1), 10)
}

function isoDaysAgo(now: Date, days: number) {
  const date = new Date(now)
  date.setUTCDate(date.getUTCDate() - days)
  return date.toISOString()
}
