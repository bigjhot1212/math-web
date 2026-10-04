import type { Question } from '@/lib/types/question'

type Key = 'a' | 'b' | 'c' | 'd' | 'e'
type Choices = NonNullable<Question['content']['choices']>
const keys: Key[] = ['a', 'b', 'c', 'd', 'e']

// Hand-written questions list the correct choice first; move it to a slot that varies by id
// so the answer key is spread across ก–จ instead of always landing on ก.
export function placeAnswer(choices: Choices, answer: Key, id: number, salt: number): { choices: Choices; answer: Key } {
  const correct = choices[answer]
  const others = keys.filter(key => key !== answer).map(key => choices[key])
  const slot = (id * 3 + salt) % 5
  others.splice(slot, 0, correct)
  return {
    choices: Object.fromEntries(keys.map((key, index) => [key, others[index]])) as Choices,
    answer: keys[slot],
  }
}
