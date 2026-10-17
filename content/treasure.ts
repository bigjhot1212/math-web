import treasureData from './treasure-data.json'

export type TreasureFormula = {
  name: string
  expression: string
  meaning: string
  condition: string
  use: string
  keywords: string
  caution: string
  mistakes: string
  // Set on formulas that show up often in exams; the page highlights them
  examFocus?: string
}

export type TreasurePair = { label: string; guidance: string }

export type TreasureExample = {
  title: string
  level: string
  problem: string
  answer: string
  formula: string
  keywords: string
  steps: string[]
  trap: string
  check: string
}

export type TreasureReference = {
  organization: string
  title: string
  url: string
  note: string
}

export type TreasureResource = {
  chapter: number
  slug: string
  topic: string
  title: string
  description: string
  readMinutes: number
  mark: string
  practiceSlug: string
  featured?: boolean
  goal: string
  takeaways: string[]
  overview: string[]
  scope: string[]
  formulas: TreasureFormula[]
  patterns: TreasurePair[]
  keywords: TreasurePair[]
  traps: string[]
  scopeNote: string
  checklist: string[]
  examples: TreasureExample[]
  references: TreasureReference[]
  sourceDocument: string
}

export const TREASURE_RESOURCES = treasureData as TreasureResource[]
export const TREASURE_TOPICS = ['ทั้งหมด', ...TREASURE_RESOURCES.map((resource) => resource.topic)]

export const TREASURE_ALIASES: Record<string, string> = {
  'set-keywords': 'set-formula-guide',
  'logic-implication': 'logic-formula-guide',
  'function-domain-checklist': 'relations-functions-formula-guide',
  'trigonometry-core-relations': 'trigonometry-formula-guide',
  'limit-indeterminate-checklist': 'calculus-formula-guide',
  'statistics-mean-variance': 'statistics-distributions-formula-guide',
}

export function getTreasureResource(slug: string) {
  const resolvedSlug = TREASURE_ALIASES[slug] ?? slug
  return TREASURE_RESOURCES.find((resource) => resource.slug === resolvedSlug)
}
