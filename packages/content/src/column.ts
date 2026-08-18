import { prisma } from '@everydaycro/db'
import { z } from 'zod'
import { complete } from './ai/index'
import { listCroIssues } from './cro/store'

export type PostRecord = Awaited<ReturnType<typeof getPostBySlug>>

const columnSchema = z
  .object({
    title: z.string().min(4).max(80),
    slug: z
      .string()
      .min(3)
      .max(80)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug 需为小写连字符格式'),
    dek: z.string().min(8).max(160),
    body: z.string().min(200),
    tags: z.array(z.string()).max(6).default([]),
  })
  .strict()

export async function listPosts(limit = 30) {
  return prisma.post.findMany({
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug } })
}

function stripCodeFence(value: string) {
  return value.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
}

/**
 * 基于近期精选 issue 生成一篇深度专题长文并写入 Post。
 * 复用与每日精选同一条 LLM 管线。
 */
export async function generateColumnPost({
  env = process.env,
  lookbackIssues = 5,
}: {
  env?: NodeJS.ProcessEnv
  lookbackIssues?: number
} = {}) {
  const issues = await listCroIssues(lookbackIssues)
  if (issues.length === 0) throw new Error('还没有精选内容，无法生成专栏')

  const digest = issues
    .map((issue) => {
      const date = new Date(issue.issueDate).toISOString().slice(0, 10)
      const lines = issue.items
        .map((it) => `  - [${it.section}] ${it.title}：${it.summary}`)
        .join('\n')
      return `${date} 第${issue.issueNumber}期\n${lines}`
    })
    .join('\n\n')

  const prompt = [
    '你是临床研究（CRO）与 AI 交叉领域的专栏作者。下面是最近几期每日精选的条目摘要。',
    '请基于这些素材，写一篇有观点、有结构的深度专题长文（中文，正文用 Markdown，含小标题），帮助临床运营从业者理解趋势、方法或工具。',
    '要求：不堆新闻，要有主线与判断；保留具体公司/产品/机构名（原文）；正文 600-1200 字。',
    '严格返回 JSON：{"title","slug","dek","body","tags"}。',
    '- slug：小写英文连字符，概括主题，如 "ai-patient-matching"。',
    '- dek：一句话摘要（≤80字）。',
    '- body：Markdown 正文。',
    '- tags：2-5 个主题标签（中文短词）。',
    '注意：字符串内部不要出现未转义双引号；确保 JSON 完整闭合；body 用 \\n 表示换行。',
    digest,
  ].join('\n')

  const text = await complete([{ role: 'user', content: prompt }], {
    env,
    system: '你是面向临床研究从业者的中文专栏作者，只返回合法 JSON。',
    maxTokens: 8000,
    temperature: 0.5,
  })

  const parsed = columnSchema.parse(JSON.parse(stripCodeFence(text)))
  const latest = issues[0]

  const post = await prisma.post.upsert({
    where: { slug: parsed.slug },
    create: {
      slug: parsed.slug,
      title: parsed.title,
      kind: 'column',
      dek: parsed.dek,
      body: parsed.body,
      tags: parsed.tags,
      issueDate: latest?.issueDate ?? null,
      publishedAt: new Date(),
    },
    update: {
      title: parsed.title,
      dek: parsed.dek,
      body: parsed.body,
      tags: parsed.tags,
      issueDate: latest?.issueDate ?? null,
      publishedAt: new Date(),
    },
  })

  return post
}
