# Treasure Surface Brief

## Objective

Create a public, free study library named “ขุมทรัพย์” that makes MathPrep's teaching method tangible before a student buys a course.

## Composition Decision

The selected structure is an exam-trap field guide: one featured dossier followed by compact reading rows, supported by persistent search and filters. It avoids a uniform card wall and gives each resource the same teaching rhythm: keyword, reasoning, trap, and action.

## Visual Translation

- Inherit the established cool dark MathPrep world, typography, border language, and accents.
- Use mathematical marks as calm editorial identifiers, not decorative generated imagery.
- Use lines, numbered sections, and compact metadata to feel like an annotated study archive.
- Preserve long-form readability on mobile and desktop.

## Content Rules

- Thai should sound spoken and direct.
- Every resource must yield an immediate, testable takeaway.
- Do not promise scores, rankings, or outcomes.
- Public access; no sign-in gate.
- Keep the approved Word chapters in `treasures/` as the editorial source, then regenerate `content/treasure-data.json` with `scripts/extract-treasure-docx.py`; no database migration is required.
- Keep one formula guide for every topic available in Practice. Each guide must include formulas, the kinds of exam questions they support, and common cautions.
