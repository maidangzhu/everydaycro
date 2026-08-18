import { PrismaClient } from './src/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

// 单例：monorepo 中所有包（content / web）都从这里取同一个 client。
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl() {
  const raw = process.env.DATABASE_URL
  if (!raw) throw new Error('DATABASE_URL is not configured')
  return raw
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: getDatabaseUrl() })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export type { PrismaClient }
// 类型与命名空间（Prisma、模型类型）从生成的 client 透出，供 content/web 使用
export { Prisma } from './src/generated/client'
export * from './src/generated/models'
