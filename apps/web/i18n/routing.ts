import { defineRouting } from 'next-intl/routing'

/** zh 为默认语言不占 URL 前缀（保 SEO），en 挂 /en 前缀。 */
export const routing = defineRouting({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix: 'as-needed',
})
