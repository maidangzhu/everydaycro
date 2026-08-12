import { NextResponse } from 'next/server'
import { generateCroIssue } from '@/lib/cro/generate'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  try {
    const force = new URL(request.url).searchParams.has('force')
    const result = await generateCroIssue({ force })
    return NextResponse.json({
      issueDate: result.issue.issueDate,
      itemCount: result.itemCount,
      cached: result.cached,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'generation failed' },
      { status: 500 },
    )
  }
}
