import { eveChannel } from 'eve/channels/eve'
import { localDev, type AuthFn } from 'eve/channels/auth'
import { auth } from '@everydaycro/auth'

/**
 * 用主站 Better Auth 会话 cookie 鉴权：浏览器同源请求会自动带上 cookie，
 * 校验通过后把用户身份挂进 session.auth，供工具层读取。
 * localDev() 兜底本地开发；生产未登录请求得到 401。
 */
const appSession = (): AuthFn<Request> => {
  return async (request) => {
    try {
      const session = await auth.api.getSession({ headers: request.headers })
      if (!session) return null
      return {
        principalId: session.user.id,
        principalType: 'user',
        authenticator: 'app',
        attributes: {
          name: session.user.name,
          email: session.user.email,
          role: session.user.role ?? 'user',
        },
      }
    } catch {
      return null
    }
  }
}

export default eveChannel({
  auth: [appSession(), localDev()],
})
