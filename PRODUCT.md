# MathPrep Product Brief

<!-- impeccable:product-schema 1 -->

## Platform

Web application built with Next.js and deployed on Vercel.

## Users

- Thai high-school students preparing for A-Level Math 1. *(Inferred from the existing product and course catalog.)*
- The teacher/admin who reviews student progress and course purchases. *(Inferred from the existing admin tools.)*

## Product Purpose

MathPrep helps students understand what a question is testing, practise by topic, simulate timed exams, review their progress, access purchased courses, and use free study resources in one place. *(Inferred from the existing product and the current request.)*

## Positioning

Teacher-led preparation that focuses on reading keywords, recognising the intended concept, and avoiding recurring exam traps before calculating an answer. *(Inferred from existing homepage copy supplied by the product owner.)*

## Operating Context

- The public site introduces the learning method and sells courses.
- Students must sign in when they begin practice or mock-exam work.
- Authentication and learning data use Supabase; production hosting uses Vercel.
- Instagram is the direct support channel.
- “ขุมทรัพย์” is a public, free learning library and must not require sign-in. *(Inferred from the current request.)*

## Capabilities and Constraints

- Practice questions are organised by mathematics topic.
- Mock exams, progress analytics, purchased-course access, and bank-transfer review already exist.
- Free resources should be editable as structured local content without needing a database migration or another secret. *(Inferred implementation constraint.)*
- The experience must work well on mobile because students are likely to visit from social links. *(Inferred from the Instagram-led acquisition flow.)*

## Brand Commitments

- Product name: MathPrep.
- Thai copy should sound like a helpful teacher speaking plainly, not like translated or institutional prose.
- Existing visual identity: cool dark navy/violet surfaces, restrained cyan and purple accents, Kanit headings, Sarabun body text, and STIX Two Math for notation.
- The product owner’s supplied credential is A-Level Math 1, 98/100; do not invent additional credentials or testimonials.

## Evidence on Hand

- Existing practice bank, mock exams, course curriculum, learning analytics, and purchase flow.
- Existing product-owner profile copy and score claim.
- No verified testimonials, learner counts, or outcome statistics are currently available.

## Product Principles

1. Understand what the question tests before looking for the answer.
2. Make every free resource useful enough to apply immediately.
3. Show learning progress with evidence, not vague encouragement.
4. Keep navigation and reading clear on small screens.
5. Prefer calm, precise teaching over decorative complexity.
