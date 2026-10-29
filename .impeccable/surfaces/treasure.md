# Treasure Surface Brief

## Objective

Create a public, free study library named “ขุมทรัพย์” that makes MathPrep's teaching method tangible before a student buys a course.

## Composition Decision

The selected structure is an exam-trap field guide: one featured dossier followed by compact reading rows, supported by persistent search and filters. It avoids a uniform card wall and gives each resource the same teaching rhythm: keyword, reasoning, trap, and action.

## Visual Translation

- Inherit the approved Math Hunters island adventure at the library entry: illustrated observatory cover, emerald identity, gold frame, and warm reading surfaces. Retain IBM Plex Sans Thai headings and Noto Sans Thai body text. Keep diagrams and equations legible with dark semantic ink colours.
- Generated scenery belongs at the entry cover; mathematical marks, formulas, and chapter text remain selectable HTML/SVG with quiet article layouts.
- Use lines, numbered sections, and compact metadata to feel like an annotated study archive.
- Preserve long-form readability on mobile and desktop.

## Content Rules

- Thai should sound spoken and direct.
- Every resource must yield an immediate, testable takeaway.
- Do not promise scores, rankings, or outcomes.
- Public access; no sign-in gate.
- Keep the approved Word chapters in `treasures/` as the editorial source, then regenerate `content/treasure-data.json` with `scripts/extract-treasure-docx.py`; no database migration is required.
- Keep one formula guide for every topic available in Practice. Each guide must include formulas, the kinds of exam questions they support, and common cautions.
- Give every chapter an in-page flash-card drill built from its formula entries; cards marked “ยังไม่แม่น” must cycle back until the learner remembers them.
