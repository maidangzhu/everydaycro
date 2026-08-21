import { headers } from 'next/headers'
import { auth } from '@everydaycro/auth'

/** server component / server action 里取当前登录会话的统一入口。 */
export async function getSessionUser() {
  return auth.api.getSession({ headers: await headers() })
}
