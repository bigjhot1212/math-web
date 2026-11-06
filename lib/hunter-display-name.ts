export function normalizeHunterDisplayName(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const name = value.normalize('NFC').trim().replace(/\s+/gu, ' ')
  const length = Array.from(name).length
  if (length < 3 || length > 24 || !/^[\p{L}\p{M}\p{N} _-]+$/u.test(name)) return null
  return name
}

export type HunterDisplayNameRow = { user_id: string; month_key: string; display_name: string }

export function hunterDisplayNameAt(rows: HunterDisplayNameRow[], userId: string, month: string): string | null {
  return rows.filter(row => row.user_id === userId && row.month_key <= month)
    .sort((a, b) => b.month_key.localeCompare(a.month_key))[0]?.display_name ?? null
}
