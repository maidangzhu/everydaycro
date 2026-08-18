import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// .env 在仓库根，prisma.config.ts 在 packages/db，需向上两级
config({ path: '../../.env.local' })
config({ path: '../../.env' })
config()

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
})
