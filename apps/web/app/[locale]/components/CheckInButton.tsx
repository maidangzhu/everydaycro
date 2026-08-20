'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@everydaycro/ui'
import { checkInAction } from '../lib/actions'
import { POINT_RULES } from '../lib/points.client'

/** 签到按钮：调 server action，成功后刷新服务端数据。 */
export function CheckInButton({ checkedIn }: { checkedIn: boolean }) {
  const t = useTranslations('member')
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function checkIn() {
    setBusy(true)
    const res = await checkInAction()
    setBusy(false)
    if (res.ok) {
      setMsg(t('checkinDone', { points: POINT_RULES.daily_checkin }))
      router.refresh()
    } else if (res.error === 'already') {
      setMsg(t('already'))
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        className="rounded-full"
        variant={checkedIn ? 'outline' : 'default'}
        disabled={checkedIn || busy}
        onClick={checkIn}
      >
        {checkedIn ? t('checkedIn') : t('checkin')}
      </Button>
      {msg ? <span className="text-xs text-primary">{msg}</span> : null}
    </div>
  )
}
