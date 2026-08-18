// 统一从仓库根加载 .env.local / .env，供 packages 下的脚本使用
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
config({ path: path.join(root, '.env.local') })
config({ path: path.join(root, '.env') })
config()
