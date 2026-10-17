/**
 * Keeps logical notation consistent with the notation commonly used in
 * Thai secondary-school textbooks. KaTeX's default \neg glyph is compact
 * and can visually merge with the following variable on dark backgrounds.
 */
export function formatMathForDisplay(math: string): string {
  return math.replace(/\\(?:neg|lnot)\s*/g, '\\mathord{\\sim}\\,')
}
