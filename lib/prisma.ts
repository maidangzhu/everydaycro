import pkg from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const { PrismaClient } = pkg
type PrismaClient = InstanceType<typeof PrismaClient>

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
