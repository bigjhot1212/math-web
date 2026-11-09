// Keep this list focused on unambiguous slurs and profanity. Substring
// matching short English words would incorrectly block ordinary names.
const THAI_PROFANITY = ['ควย', 'เย็ด', 'เหี้ย', 'สัส', 'สัตว์นรก', 'ชาติหมา', 'กะหรี่', 'กระหรี่', 'อีดอก', 'ไอ้ดอก']
const ENGLISH_PROFANITY = ['fuck', 'fucking', 'fucker', 'motherfucker', 'shit', 'bitch', 'asshole', 'cunt', 'nigger', 'nigga']

export function isHunterNameAllowed(name: string): boolean {
  const normalized = name.normalize('NFKC').toLocaleLowerCase('en-US')
  const compact = normalized.replace(/[\s_-]+/gu, '')
  if (THAI_PROFANITY.some(word => compact.includes(word))) return false
  const words = normalized.split(/[^a-z]+/u).filter(Boolean)
  if (normalized.split(/[\s_-]+/u).includes('หี')) return false
  return !ENGLISH_PROFANITY.includes(compact) && !words.some(word => ENGLISH_PROFANITY.includes(word))
}

export function normalizeHunterDisplayName(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const name = value.normalize('NFC').trim().replace(/\s+/gu, ' ')
  const length = Array.from(name).length
  if (length < 3 || length > 24 || !/^[\p{L}\p{M}\p{N} _-]+$/u.test(name)) return null
  return name
}

export type HunterDisplayNameRow = { user_id: string; month_key: string; display_name: string }

export function hunterDisplayNameAt(rows: HunterDisplayNameRow[], userId: string, month: string): string | null {
  const name = rows.filter(row => row.user_id === userId && row.month_key <= month)
    .sort((a, b) => b.month_key.localeCompare(a.month_key))[0]?.display_name
  return name && isHunterNameAllowed(name) ? name : null
}
