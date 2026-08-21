import { auth } from '@everydaycro/auth'

/** Better Auth 的 HTTP 入口：/api/auth/sign-in、/api/auth/sign-up 等全部走这里。 */
const handler = (req: Request) => auth.handler(req)

export { handler as GET, handler as POST }
