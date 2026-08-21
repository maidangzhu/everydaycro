import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { listPosts } from '@everydaycro/content'

/** 专栏文章列表（标题 + 摘要 + slug）。 */
export default defineTool({
  description:
    '获取专栏深度文章列表（标题、一句话摘要、标签、slug）。用户想看专栏或按主题找文章时先用它，再用 get_post 读全文。',
  inputSchema: z.object({}),
  async execute() {
    const posts = await listPosts(20)
    return {
      count: posts.length,
      posts: posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        dek: post.dek,
        tags: post.tags,
        publishedAt: post.publishedAt?.toISOString().slice(0, 10) ?? null,
      })),
    }
  },
})
