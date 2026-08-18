import { generateText, gateway, stepCountIs } from 'ai'
import type { CroSearchRoute, ExaNewsResult } from './types'
import { CRO_SEARCH_ROUTES } from './exa'

/**
 * 用 AI Gateway 的免费 Exa web search 做召回（替代直调 api.exa.ai，不烧 EXA_API_KEY）。
 *
 * gateway exaSearch 是模型驱动的 provider 工具：这里用一个免费模型当"工具调度器"，
 * 强制它调用 exaSearch 并把原始结果以 JSON 透传回来，再归一化成 ExaNewsResult[]，
 * 与直调 Exa 的输出结构完全一致，下游 buildCandidates / curateCroIssue 不用改。
 */

// gateway exaSearch 返回的单条结构（只要用到的字段）
type GatewayExaResult = {
  title?: string
  url?: string
  publishedDate?: string | null
  summary?: string
  highlights?: string[]
  text?: string
}

type GatewayExaOutput =
  | { results?: GatewayExaResult[] }
  | { error?: string; message?: string }

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

/** 从一次工具调用结果里取出 Exa 结果数组。 */
function extractResults(output: unknown): GatewayExaResult[] {
  if (!isRecord(output)) return []
  const o = output as GatewayExaOutput
  if (Array.isArray((o as { results?: unknown }).results)) {
    return (o as { results: GatewayExaResult[] }).results
  }
  return []
}

function toNewsResult(item: GatewayExaResult, route: CroSearchRoute): ExaNewsResult | null {
  if (!item.title || !item.url) return null
  const snippet = item.summary ?? item.highlights?.find((h) => h?.trim()) ?? item.text
  return {
    title: item.title,
    url: item.url,
    ...(snippet ? { snippet: snippet.trim() } : {}),
    sourceName: publisherFromUrl(item.url),
    ...(item.publishedDate ? { publishedAt: item.publishedDate } : {}),
    searchRoute: route,
  }
}

function publisherFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return '来源网站'
  }
}

/** 单条路由：让免费模型调 exaSearch，把结果归一化返回。 */
export async function searchRouteWithGateway({
  route,
  lookbackDays = 7,
  now = new Date(),
  model = process.env.AI_GATEWAY_MODEL ?? 'openai/gpt-4.1-mini',
  env = process.env,
}: {
  route: (typeof CRO_SEARCH_ROUTES)[number]
  lookbackDays?: number
  now?: Date
  model?: string
  env?: NodeJS.ProcessEnv
}): Promise<ExaNewsResult[]> {
  const gatewayKey = env.AI_GATEWAY_EVERYDAY_CRO ?? env.AI_GATEWAY_API_KEY
  if (!gatewayKey?.trim()) throw new Error('AI_GATEWAY_EVERYDAY_CRO is required')
  // AI SDK 固定读 AI_GATEWAY_API_KEY，桥接一下
  process.env.AI_GATEWAY_API_KEY = gatewayKey

  const startDate = isoDaysAgo(now, lookbackDays)
  const collected = new Map<string, ExaNewsResult>()

  await generateText({
    model: gateway(model),
    system:
      '你是检索调度器。对用户给的检索任务，必须调用 exa_search 工具获取结果，不要自己编造。调用后用一两句话概括即可。',
    prompt: route.query,
    tools: {
      exa_search: gateway.tools.exaSearch({
        numResults: route.limit,
        ...(route.category ? { category: route.category } : {}),
        startPublishedDate: startDate,
        contents: { highlights: true, text: { verbosity: 'compact' } },
      }),
    },
    // 强制首步就调工具
    toolChoice: 'required',
    stopWhen: stepCountIs(3),
    onStepFinish(step) {
      for (const tr of step.toolResults ?? []) {
        // 只收 exa_search 的结果
        if ((tr as { toolName?: string }).toolName !== 'exa_search') continue
        const output = (tr as { output?: unknown }).output
        for (const item of extractResults(output)) {
          const r = toNewsResult(item, route.id)
          if (r && !collected.has(r.url)) collected.set(r.url, r)
        }
      }
    },
  })

  return [...collected.values()].slice(0, route.limit)
}

/** 全路由召回，等价于 searchCroNewsRoutesWithExa。串行 + 间隔，避开免费层 RPM 限流。 */
export async function searchCroNewsRoutesWithGateway({
  lookbackDays = 7,
  now = new Date(),
  model,
  env = process.env,
  routeDelayMs = 2500,
}: {
  lookbackDays?: number
  now?: Date
  model?: string
  env?: NodeJS.ProcessEnv
  /** 路由间间隔，默认 2.5s，避开免费层限流 */
  routeDelayMs?: number
} = {}): Promise<ExaNewsResult[]> {
  const out: ExaNewsResult[] = []
  for (const route of CRO_SEARCH_ROUTES) {
    try {
      const r = await searchRouteWithGateway({ route, lookbackDays, now, model, env })
      out.push(...r)
    } catch (err) {
      console.warn(`gateway route ${route.id} failed:`, (err as Error)?.message ?? err)
    }
    if (routeDelayMs > 0) await sleep(routeDelayMs)
  }
  return out
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function isoDaysAgo(now: Date, days: number) {
  const date = new Date(now)
  date.setUTCDate(date.getUTCDate() - days)
  return date.toISOString()
}
