import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { createAccessControl } from 'better-auth/plugins/access'
import { admin } from 'better-auth/plugins'
import { prisma } from '@everydaycro/db'

/**
 * 角色 × 权限矩阵（声明式，后续做后台可配置时以这里为唯一事实源）：
 *
 * | 角色   | content                | user       | admin:access | agent:use |
 * |--------|------------------------|------------|--------------|-----------|
 * | user   | read                   | -          | -            | ✓         |
 * | editor | read, create, update   | -          | -            | ✓         |
 * | admin  | read, create, update, delete | read, manage | ✓     | ✓         |
 */
const statement = {
  content: ['read', 'create', 'update', 'delete'],
  user: ['read', 'manage'],
  admin: ['access'],
  agent: ['use'],
} as const

export const ac = createAccessControl(statement)

export const userRole = ac.newRole({
  content: ['read'],
  agent: ['use'],
})

export const editorRole = ac.newRole({
  content: ['read', 'create', 'update'],
  agent: ['use'],
})

export const adminRole = ac.newRole({
  content: ['read', 'create', 'update', 'delete'],
  user: ['read', 'manage'],
  admin: ['access'],
  agent: ['use'],
})

export type Role = 'user' | 'editor' | 'admin'
export const ROLES: Role[] = ['user', 'editor', 'admin']

/** 首个超管：把邮箱或用户 id 写进 ADMIN_USER_IDS（逗号分隔）即可自举，无需手动改库。 */
const adminUserIds = (process.env.ADMIN_USER_IDS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

/** 后台/敏感操作的统一角色判定（admin 角色 或 自举名单）。 */
export function isAdminUser(user: { id: string; email: string; role?: string | null }) {
  return user.role === 'admin' || adminUserIds.includes(user.id) || adminUserIds.includes(user.email)
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    // 5 分钟 cookie 缓存：导航栏读登录态不必每次打库
    cookieCache: { enabled: true, maxAge: 300 },
  },
  plugins: [
    admin({
      adminRoles: ['admin'],
      adminUserIds,
      ac,
      roles: {
        user: userRole,
        editor: editorRole,
        admin: adminRole,
      },
    }),
  ],
})

export type Session = typeof auth.$Infer.Session

/** server component / server action 里取当前会话的统一入口。 */
export async function getSession(headers: Headers) {
  return auth.api.getSession({ headers })
}
