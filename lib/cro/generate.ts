import { searchCroNewsRoutesWithExa, type ExaNewsTransport } from './exa'
import { buildCandidates, issueDateFor, issueNumberFor } from './issue'
import { curateCroIssue } from './editor'
import { getCroIssueByDate, saveCroIssue } from './store'

export async function generateCroIssue({
  apiKey = process.env.EXA_API_KEY,
  now = new Date(),
  lookbackDays = 7,
  transport,
  force = false,
  env = process.env,
}: {
  apiKey?: string
  now?: Date
  lookbackDays?: number
  transport?: ExaNewsTransport
  force?: boolean
  env?: NodeJS.ProcessEnv
} = {}) {
  if (!apiKey?.trim()) {
    throw new Error('EXA_API_KEY is required')
  }

  const issueDate = issueDateFor(now)
  if (!force) {
    const existing = await getCroIssueByDate(issueDate)
    if (existing) return { issue: existing, itemCount: existing.items.length, cached: true }
  }

  const results = await searchCroNewsRoutesWithExa({
    apiKey,
    lookbackDays,
    transport,
    now,
  })
  if (results.length === 0) {
    throw new Error('CRO + AI generation found no results')
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
    candidateCount: candidates.length,
    itemCount: saved.items.length,
  })

  return { issue: saved, itemCount: saved.items.length, cached: false }
}
