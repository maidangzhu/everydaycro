import path from 'node:path'
import { config as loadEnv } from 'dotenv'
import type { NextConfig } from 'next'
import { withEve } from 'eve/next'
import createNextIntlPlugin from 'next-intl/plugin'

// 构建/收集 page data 时，Next 在 apps/web 下不会自动加载仓库根的 .env，这里手动注入
loadEnv({ path: path.resolve(__dirname, '../../.env.local') })
loadEnv({ path: path.resolve(__dirname, '../../.env') })

const withIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  // monorepo：指向仓库根，保证输出文件追踪与 .env 解析正确
  outputFileTracingRoot: path.join(__dirname, '../../'),
  // 让 Next 编译 workspace 内的 TS 包（content/ui/db/auth 直接出 .ts）
  transpilePackages: [
    '@everydaycro/content',
    '@everydaycro/ui',
    '@everydaycro/db',
    '@everydaycro/auth',
  ],
  // workspace 的 ui 包在 node_modules 里是 symlink，webpack 对其内部相对导入不补 .tsx 扩展。
  // 用 alias 把 ui 源目录钉死，配合 extensions 让 .tsx/.ts 可解析。
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@everydaycro/ui': path.resolve(__dirname, '../../packages/ui/src'),
    }
    config.resolve.extensions = [
      ...['.tsx', '.ts'],
      ...(config.resolve.extensions ?? []),
    ]
    config.resolve.extensionAlias = {
      ...(config.resolve.extensionAlias ?? {}),
      '.js': ['.ts', '.tsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
    }
    return config
  },
}

// withEve：把 apps/web/agent 挂到同域 /eve/v1/*，与 Next 应用一体构建部署
export default withEve(withIntl(nextConfig))
