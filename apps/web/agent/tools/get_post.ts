import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { getPostBySlug } from '@everydaycro/content'

/** 按 slug 读一篇专栏文章的全文（Markdown）。 */
export default defineTool({
  description:
    '按 slug 读取一篇专栏文章的完整 Markdown 正文。先用 list_posts 拿到 slug 再调用它。',
  inputSchema: z.object({
    slug: z.string().min(1),
  }),
  async execute({ slug }) {
    const post = await getPostBySlug(slug)
    if (!post) return { found: false, slug }

    return {
      found: true,
      title: post.title,
      dek: post.dek,
      tags: post.tags,
      publishedAt: post.publishedAt?.toISOString().slice(0, 10) ?? null,
      body: post.body,
    }
  },
})
