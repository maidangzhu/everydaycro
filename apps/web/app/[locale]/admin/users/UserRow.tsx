'use client'

import { useState, useTransition } from 'react'
import { Button } from '@everydaycro/ui'
import { setUserRoleAction, setBannedAction } from '../actions'

type User = {
  id: string
  email: string
  name: string
  role: string
  banned: boolean
  points: number
  createdAt: string
}

export function UserRow({
  user,
  isSelf,
  labels,
}: {
  user: User
  isSelf: boolean
  labels: { active: string; banned: string; ban: string; unban: string; save: string }
}) {
  const [role, setRole] = useState(user.role)
  const [pending, startTransition] = useTransition()

  return (
    <tr className="border-b align-middle">
      <td className="p-2">
        {user.email}
        {isSelf ? <span className="ml-1 text-xs text-muted-foreground">（you）</span> : null}
      </td>
      <td className="p-2">{user.name}</td>
      <td className="p-2">
        <select
          value={role}
          disabled={isSelf || pending}
          onChange={(e) => setRole(e.target.value)}
          onBlur={() => {
            if (role !== user.role) {
              startTransition(async () => {
                await setUserRoleAction(user.id, role)
              })
            }
          }}
          className="rounded-md border border-input bg-transparent px-2 py-1 text-xs"
        >
          <option value="user">user</option>
          <option value="editor">editor</option>
          <option value="admin">admin</option>
        </select>
      </td>
      <td className="p-2">{user.points}</td>
      <td className="p-2">
        {user.banned ? (
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
            {labels.banned}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">{labels.active}</span>
        )}
      </td>
      <td className="p-2 text-muted-foreground">{user.createdAt}</td>
      <td className="p-2">
        {isSelf ? null : (
          <Button
            size="sm"
            variant={user.banned ? 'outline' : 'ghost'}
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await setBannedAction(user.id, !user.banned)
              })
            }
          >
            {user.banned ? labels.unban : labels.ban}
          </Button>
        )}
      </td>
    </tr>
  )
}
