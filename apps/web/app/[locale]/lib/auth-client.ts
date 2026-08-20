import { createAuthClient } from 'better-auth/client'
import { adminClient } from 'better-auth/client/plugins'

/** 浏览器端 Better Auth client：登录/注册/退出都用它。 */
export const authClient = createAuthClient({
  plugins: [adminClient()],
})
