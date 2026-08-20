'use client'

import { useState, useTransition } from 'react'
import { Button } from '@everydaycro/ui'
import { generateIssueAction, generatePostAction, setPostPublishedAction } from '../actions'

export function GenerateButtons({
  labels,
}: {
  labels: { issue: string; post: string; generating: string; ok: string; failed: string }
}) {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)

  function run(kind: 'issue' | 'post') {
    setMsg(null)
    startTransition(async () => {
      const res =
        kind === 'issue' ? await generateIssueAction() : await generatePostAction()
      setMsg(res.ok ? labels.ok : labels.failed)
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button disabled={pending} onClick={() => run('issue')} className="rounded-full">
        {pending ? labels.generating : labels.issue}
      </Button>
      <Button
        variant="outline"
        disabled={pending}
        onClick={() => run('post')}
        className="rounded-full"
      >
        {pending ? labels.generating : labels.post}
      </Button>
      {msg ? <span className="text-xs text-muted-foreground">{msg}</span> : null}
    </div>
  )
}

export function PostPublishToggle({
  postId,
  published,
  labels,
}: {
  postId: string
  published: boolean
  labels: { published: string; draft: string; publish: string; unpublish: string }
}) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="ml-2 flex shrink-0 items-center gap-2">
      <span
        className={`text-xs ${
          published ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        {published ? labels.published : labels.draft}
      </span>
      <Button
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await setPostPublishedAction(postId, !published)
          })
        }
      >
        {published ? labels.unpublish : labels.publish}
      </Button>
    </div>
  )
}
