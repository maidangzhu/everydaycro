import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// 只处理页面路由：/api（Better Auth）、/eve（agent 运行时）、静态资源均跳过。
export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|eve|_next|_vercel|.*\\..*).*)'],
}
