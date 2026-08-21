import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { SectionHead } from '../../components/SectionHead'
import { GlossarySearch } from './GlossarySearch'

export const metadata = { title: '名词速查' }

export default async function GlossaryPage() {
  const t = await getTranslations('learnPage')
  return (
    <div>
      <SectionHead title={t('glossaryTitle')} sub={t('glossarySub')} />
      <Suspense>
        <GlossarySearch />
      </Suspense>
    </div>
  )
}
