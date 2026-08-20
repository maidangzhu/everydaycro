import { createOpenAI } from '@ai-sdk/openai'
import { defineAgent } from 'eve'

/**
 * 模型走 OpenRouter（OpenAI 兼容协议），与 packages/content 的生成管线
 * 复用同一组环境变量（OPENROUTER_API_KEY / OPENROUTER_MODEL）。
 */
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
  baseURL: process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1',
})

export default defineAgent({
  model: openrouter(process.env.OPENROUTER_MODEL ?? 'z-ai/glm-5.2'),
  // 自定义 OpenRouter 模型没有 AI Gateway 元数据，显式给上下文窗口（128K），
  // 否则 compaction 编译期查不到窗口大小会直接启动失败。
  modelContextWindowTokens: 131_072,
})
