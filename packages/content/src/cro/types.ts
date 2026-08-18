export type CroSection =
  | 'lead'
  | 'trial'
  | 'tooling'
  | 'company'
  | 'policy'

export type CroSearchRoute =
  | 'lead'
  | 'trial'
  | 'tooling'
  | 'company'
  | 'policy'

export type CroSourceDraft = {
  title: string
  url: string
  publisher?: string
  publishedAt?: string
  excerpt?: string
}

export type CroItemDraft = {
  rank: number
  section: CroSection
  title: string
  summary: string
  detail: string
  takeaway: string
  sources: CroSourceDraft[]
}

export type CroIssueDraft = {
  issueDate: string
  issueNumber: number
  headline: string
  dek: string
  summary: string
  sourceCount: number
  items: CroItemDraft[]
}

export type ExaNewsResult = {
  title: string
  url: string
  snippet?: string
  sourceName?: string
  publishedAt?: string
  searchRoute?: CroSearchRoute
}
