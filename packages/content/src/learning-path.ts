import { QUIZ_BANK, type QuizQuestion } from './quiz'

/**
 * 学习路径：把题库按主题编排为 5 周（4 周入门 + 第 5 周新版 GCP 加更），路径只是"编排数据"，题目仍以 QUIZ_BANK 为单一出处。
 * 每周列出题 id，前端按序闯关。
 */
export type LearningWeek = {
  week: number
  slug: string
  title: string
  desc: string
  questionIds: string[]
}

export const LEARNING_PATH: LearningWeek[] = [
  {
    week: 1,
    slug: 'cro-basics',
    title: 'CRO 基础与角色',
    desc: '搞清谁是谁：CRO、申办方、CRA、PI、CRC、Site、CRM…',
    questionIds: ['cro-1', 'sponsor-cro', 'site', 'cra', 'cra-level', 'pi', 'crm', 'ctc'],
  },
  {
    week: 2,
    slug: 'trial-design',
    title: '试验设计',
    desc: '随机、盲法、终点、PICO、交叉、适应性、主方案、安慰剂。',
    questionIds: [
      'randomization', 'blinding', 'primary-endpoint', 'placebo', 'pico',
      'crossover', 'adaptive', 'master-protocol', 'phase-1', 'phase-2', 'phase-3', 'phase-4',
    ],
  },
  {
    week: 3,
    slug: 'regulatory',
    title: '法规与合规',
    desc: 'GCP、伦理、知情同意、Part 11、PHI、GxP、药物警戒、SAE。',
    questionIds: [
      'gcp', 'irb', 'informed-consent', 'part11', 'phi', 'gxp',
      'pha-vigilance', 'ae-sae', 'pv-abbr', 'ich',
    ],
  },
  {
    week: 4,
    slug: 'stats-ai',
    title: '统计与 AI 应用',
    desc: 'ITT、样本量、OS/PFS、非劣效，以及 AI 在招募/匹配/合成对照的落地。',
    questionIds: [
      'itt', 'sample-size', 'survival', 'noninferiority', 'e6-e9',
      'ai-matching', 'eligibility', 'synthetic-control', 'decentralized', 'rwe',
      'cro-trend', 'edc', 'edc-abbr', 'med-writing',
    ],
  },
  {
    week: 5,
    slug: 'gcp-e6r3',
    title: '加更 · 新版 GCP 专题',
    desc: 'ICH E6(R3) 与中国 2026 版 GCP：QbD、风险相称、数据治理、责任边界，一次过完新规要点。',
    questionIds: [
      'e6r3-structure', 'e6r3-timeline', 'e6r3-annex2', 'e6r3-qbd',
      'e6r3-proportionate', 'e6r3-datagov',
      'nmpa-gcp-date', 'nmpa-gcp-structure', 'nmpa-participant',
      'nmpa-responsibility', 'nmpa-transition', 'nmpa-ai',
    ],
  },
]

const bankById = new Map(QUIZ_BANK.map((q) => [q.id, q]))

/** 取某周的题目（按声明顺序，忽略不存在的 id）。 */
export function getWeekQuestions(weekSlug: string): QuizQuestion[] {
  const week = LEARNING_PATH.find((w) => w.slug === weekSlug)
  if (!week) return []
  return week.questionIds
    .map((id) => bankById.get(id))
    .filter((q): q is QuizQuestion => Boolean(q))
}

export function getWeek(weekSlug: string): LearningWeek | undefined {
  return LEARNING_PATH.find((w) => w.slug === weekSlug)
}
