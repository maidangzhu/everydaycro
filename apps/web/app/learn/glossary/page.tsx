import { Suspense } from 'react'
import { SectionHead } from '../../components/SectionHead'
import { GlossarySearch } from './GlossarySearch'

export const metadata = { title: '名词速查' }

export default function GlossaryPage() {
  return (
    <div>
      <SectionHead title="名词速查" sub="行业缩写 / 术语，随查随用" />
      <Suspense>
        <GlossarySearch />
      </Suspense>
    </div>
  )
}
