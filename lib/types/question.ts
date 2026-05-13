export type QuestionLevel = "ONET" | "A-Level" | "PAT1"
export type Difficulty = "easy" | "medium" | "hard"
export type QuestionType = "multiple-choice" | "short-answer"

export type Question = {
  id: string
  topicId: string
  subtopic: string
  level: QuestionLevel
  difficulty: Difficulty
  type: QuestionType

  content: {
    text: string
    image?: string
    choices?: {
      a: string
      b: string
      c: string
      d: string
      e: string
    }
  }

  answer: "a" | "b" | "c" | "d" | "e"
  hint: string
  solution: {
    steps: string[]
    keyFormula?: string
  }

  tags: string[]
  source?: string
}