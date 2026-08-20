import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/** 全站统一从 '@/i18n/navigation' 导入 Link/router，自动带 locale 前缀。 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
