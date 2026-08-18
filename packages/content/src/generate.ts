// 加载仓库根的 .env（脚本在 packages/content 下运行）
import './env'
import { generateCroIssue } from './cro/generate'

async function main() {
  const force = process.argv.includes('--force')
  const result = await generateCroIssue({ force })
  console.log(
    result.cached
      ? `已存在 ${result.issue.issueDate}，跳过（用 --force 重新生成）`
      : `已生成 ${result.issue.issueDate}，共 ${result.itemCount} 条`,
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
