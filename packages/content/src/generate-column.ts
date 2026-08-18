import './env'
import { generateColumnPost } from './column'

async function main() {
  const post = await generateColumnPost()
  console.log(`已生成专栏：${post.title}（/column/${post.slug}）`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
