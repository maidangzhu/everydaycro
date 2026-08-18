import { searchCroNewsRoutesWithExa, type ExaNewsTransport } from './exa'
import { searchCroNewsRoutesWithGateway } from './gateway-exa'
import { buildCandidates, issueDateFor, issueNumberFor } from './issue'
import { curateCroIssue } from './editor'
import { getCroIssueByDate, saveCroIssue } from './store'
import type { ExaNewsResult } from './types'

/**
 * 召回来源：
 * - 'gateway'（默认）：AI Gateway 免费 Exa web search，用 AI_GATEWAY_EVERYDAY_CRO，不烧 EXA_API_KEY。
 * - 'exa'：直调 api.exa.ai（需要 EXA_API_KEY），作为回退。
 * 用 SEARCH_PROVIDER=exa 可切回直调。
 */
async function recall({
  provider,
  apiKey,
  lookbackDays,
  transport,
  now,
  env,
}: {
  provider: string
  apiKey?: string
  lookbackDays: number
  transport?: ExaNewsTransport
  now: Date
  env: NodeJS.ProcessEnv
}): Promise<ExaNewsResult[]> {
  if (provider === 'gateway') {
    return searchCroNewsRoutesWithGateway({ lookbackDays, now, env })
  }
  if (!apiKey?.trim()) throw new Error('EXA_API_KEY is required')
  return searchCroNewsRoutesWithExa({ apiKey, lookbackDays, transport, now })
}

export async function generateCroIssue({
  apiKey = process.env.EXA_API_KEY,
  now = new Date(),
  lookbackDays = 7,
  transport,
  force = false,
  provider = process.env.SEARCH_PROVIDER ?? 'gateway',
  env = process.env,
}: {
  apiKey?: string
  now?: Date
  lookbackDays?: number
  transport?: ExaNewsTransport
  force?: boolean
  /** 'gateway'（默认，免费 Exa）| 'exa'（直调） */
  provider?: string
  env?: NodeJS.ProcessEnv
} = {}) {
  const issueDate = issueDateFor(now)
  if (!force) {
    const existing = await getCroIssueByDate(issueDate)
    if (existing) return { issue: existing, itemCount: existing.items.length, cached: true }
  }

  // 召回：默认 gateway（免费 Exa）。若 gateway 全空（如免费额度限流）且有 EXA_API_KEY，回退直调 Exa。
  let results = await recall({ provider, apiKey, lookbackDays, transport, now, env })
  if (results.length === 0 && provider === 'gateway' && apiKey?.trim()) {
    console.warn('gateway recall empty, falling back to direct Exa')
    results = await recall({ provider: 'exa', apiKey, lookbackDays, transport, now, env })
  }
  if (results.length === 0) {
    throw new Error(`CRO + AI generation found no results (provider=${provider})`)
  }

  const candidates = buildCandidates(results)
  const draft = await curateCroIssue({
    candidates,
    issueDate,
    issueNumber: issueNumberFor(issueDate),
    env,
  })
  const saved = await saveCroIssue(draft)

  console.info('everydaycro generated', {
    issueDate,
    provider,
    candidateCount: candidates.length,
    itemCount: saved.items.length,
  })

  return { issue: saved, itemCount: saved.items.length, cached: false }
}
