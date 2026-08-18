import { createOpenAI } from '@ai-sdk/openai'
import { generateText, type LanguageModel } from 'ai'

export type AiChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type AiProvider = {
  id: string
  model: LanguageModel
}

/**
 * 抽象的 AI provider 工厂。当前默认走 OpenRouter（OpenAI 兼容协议），
 * 以后要加别的 provider（直连 OpenAI、Moonshot 等），在这里扩展即可，
 * 调用方只用 complete()，不关心底层是谁。
 */
export function getAiProvider(env = process.env): AiProvider {
  const apiKey = env.OPENROUTER_API_KEY
  if (!apiKey?.trim()) throw new Error('OPENROUTER_API_KEY is required')

  const openrouter = createOpenAI({
    apiKey,
    baseURL: env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1',
  })

  const model = env.OPENROUTER_MODEL ?? 'z-ai/glm-5.2'
  return { id: 'openrouter', model: openrouter(model) }
}

export async function complete(
  messages: AiChatMessage[],
  {
    env = process.env,
    system,
    maxTokens = 4000,
    temperature,
  }: {
    env?: NodeJS.ProcessEnv
    system?: string
    maxTokens?: number
    temperature?: number
  } = {},
): Promise<string> {
  const provider = getAiProvider(env)
  const { text } = await generateText({
    model: provider.model,
    ...(system ? { system } : {}),
    messages,
    maxOutputTokens: maxTokens,
    ...(temperature !== undefined ? { temperature } : {}),
  })
  return text
}
