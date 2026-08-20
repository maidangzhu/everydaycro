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

/**
 * 惰性单例：import 本包不再立即创建 client（缺 DATABASE_URL 时不在模块评估期抛错，
 * EVE agent 等独立运行时才能顺利加载 authored 模块），首次真正用到时才连接。
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    if (!globalForPrisma.prisma) globalForPrisma.prisma = createPrismaClient()
    const value = Reflect.get(globalForPrisma.prisma, prop, receiver)
    return typeof value === 'function' ? value.bind(globalForPrisma.prisma) : value
  },
})

export type { PrismaClient }
// 类型与命名空间（Prisma、模型类型）从生成的 client 透出，供 content/web 使用
export { Prisma } from './src/generated/client'
export * from './src/generated/models'
