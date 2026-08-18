import type { Prisma, PrismaClient } from '@everydaycro/db'
import { prisma } from '@everydaycro/db'
import type { CroIssueDraft } from './types'

export const CRO_RETENTION_LIMIT = 30

const issueInclude = {
  items: {
    orderBy: { rank: 'asc' as const },
    include: {
      sources: { orderBy: { createdAt: 'asc' as const } },
    },
  },
}

export type CroIssueRecord = Prisma.CroIssueGetPayload<{
  include: typeof issueInclude
}>

export async function saveCroIssue(issue: CroIssueDraft, client: PrismaClient = prisma) {
  const saved = await client.$transaction(async (tx) => {
    const existing = await tx.croIssue.findUnique({
      where: { issueDate: new Date(`${issue.issueDate}T00:00:00.000Z`) },
      select: { id: true },
    })

    if (existing) {
      await tx.croItem.deleteMany({ where: { issueId: existing.id } })
      await tx.croIssue.update({
        where: { id: existing.id },
        data: issueToUpdateInput(issue),
      })
      await createIssueItems(tx, existing.id, issue)
      return getIssueById(existing.id, tx)
    }

    const created = await tx.croIssue.create({
      data: issueToCreateInput(issue),
      select: { id: true },
    })
    await createIssueItems(tx, created.id, issue)
    return getIssueById(created.id, tx)
  }, { maxWait: 10_000, timeout: 20_000 })

  await pruneCroIssues(client)
  return saved
}

export async function listCroIssues(limit = CRO_RETENTION_LIMIT, client: PrismaClient = prisma) {
  return client.croIssue.findMany({
    where: { status: 'published' },
    orderBy: { issueDate: 'desc' },
    take: limit,
    include: issueInclude,
  })
}

export async function getLatestCroIssue(client: PrismaClient = prisma) {
  return client.croIssue.findFirst({
    where: { status: 'published' },
    orderBy: { issueDate: 'desc' },
    include: issueInclude,
  })
}

export async function getCroIssueByDate(issueDate: string, client: PrismaClient = prisma) {
  return client.croIssue.findFirst({
    where: {
      issueDate: new Date(`${issueDate}T00:00:00.000Z`),
      status: 'published',
    },
    include: issueInclude,
  })
}

export async function pruneCroIssues(client: PrismaClient = prisma) {
  const keep = await client.croIssue.findMany({
    orderBy: { issueDate: 'desc' },
    select: { id: true },
    take: CRO_RETENTION_LIMIT,
  })
  const keepIds = keep.map((issue) => issue.id)
  if (keepIds.length < CRO_RETENTION_LIMIT) return { count: 0 }

  return client.croIssue.deleteMany({ where: { id: { notIn: keepIds } } })
}

type CroTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

async function createIssueItems(
  client: CroTransactionClient,
  issueId: string,
  issue: CroIssueDraft,
) {
  for (const item of issue.items) {
    await client.croItem.create({
      data: {
        issueId,
        rank: item.rank,
        section: item.section,
        title: item.title,
        summary: item.summary,
        detail: item.detail,
        takeaway: item.takeaway,
        sources: {
          create: item.sources.map((source) => ({
            title: source.title,
            url: source.url,
            ...(source.publisher ? { publisher: source.publisher } : {}),
            ...(source.publishedAt ? { publishedAt: new Date(source.publishedAt) } : {}),
            ...(source.excerpt ? { excerpt: source.excerpt } : {}),
          })),
        },
      },
    })
  }
}

async function getIssueById(id: string, client: CroTransactionClient | PrismaClient) {
  const issue = await client.croIssue.findUnique({ where: { id }, include: issueInclude })
  if (!issue) throw new Error('CRO issue was not found after write')
  return issue
}

function issueToCreateInput(issue: CroIssueDraft): Prisma.CroIssueCreateInput {
  return {
    issueDate: new Date(`${issue.issueDate}T00:00:00.000Z`),
    issueNumber: issue.issueNumber,
    headline: issue.headline,
    dek: issue.dek,
    summary: issue.summary,
    sourceCount: issue.sourceCount,
    publishedAt: new Date(),
  }
}

function issueToUpdateInput(issue: CroIssueDraft): Prisma.CroIssueUpdateInput {
  return {
    issueNumber: issue.issueNumber,
    headline: issue.headline,
    dek: issue.dek,
    summary: issue.summary,
    sourceCount: issue.sourceCount,
    publishedAt: new Date(),
  }
}
