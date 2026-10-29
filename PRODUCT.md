# Math Hunters Association Product Brief

<!-- impeccable:product-schema 1 -->

## Platform

Web application built with Next.js and deployed on Vercel.

## Users

- Thai high-school students preparing for A-Level Math 1. *(Inferred from the existing product and course catalog.)*
- The teacher/admin who reviews student progress and course purchases. *(Inferred from the existing admin tools.)*

## Product Purpose

Math Hunters Association helps students understand what a question is testing, practise by topic, simulate timed exams, review their progress, access purchased courses, and use free study resources in one place. *(Inferred from the existing product and the current request.)*

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

- Product name: Math Hunters Association; use “Math Hunters” in compact interface contexts.
- Thai copy should sound like a helpful teacher speaking plainly, not like translated or institutional prose.
- Approved visual identity: an original colourful anime island adventure with emerald/turquoise scenery, golden illustrated frames, and warm parchment card interiors. Retain IBM Plex Sans Thai headings, Noto Sans Thai body text, dedicated mathematical rendering, the Math Hunters name, and the approved Infinity Atlas emblem (an open book, infinity loop, and discovery star). The island and mission cards carry the expressive visual treatment; equations, checkout, and admin actions remain steady and readable.
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
5. Make exploration lively while keeping mathematical teaching precise and actions immediate.

## Approved Redesign Behaviour

- Public navigation leads with free practice; signed-in learning has its own desktop sidebar and labelled mobile navigation. Admin has a separate management menu.
- Dashboard is the student headquarters and the default sign-in destination. Explicit return destinations and required onboarding take precedence.
- Use paired Thai hunter terminology while keeping mathematical, financial, and admin instructions literal.
- Hunter licenses show only the existing identity and measured training data. No invented membership numbers, XP, ranks, badges, or ranking placeholders.
- Active solving and exams use a compact frame with no full navigation or floating support. Instagram support floats only on the homepage, catalogue, cart, checkout, and purchase-success pages.
- Keep the existing question bank, course prices/access, scoring, progress calculations, payment processing, and legal wording. No database migration is part of the redesign. Motion is the single added animation engine; use CSS/SVG for ambient scenery.

## Animated Island Adventure

- Headquarters leads with one island containing all 14 existing topics: six in ม.4, five in ม.5, and three in ม.6. Paths imply exploration, never prerequisites. The existing training recommendation sits beside the map on desktop.
- Explicit map and mission-card views share search, grade filters, completion data, and selected-topic state through one catalogue in `lib/adventure-topics.ts`. A topic opens a keyboard-accessible desktop side panel/mobile bottom sheet with its Thai/English name, mathematical symbol, actual completion, and original start/resume route.
- The hunter license is an interactive collectible card showing actual profile, answers, accuracy, and streak only.
- Eleven original generated WebP illustrations live in `public/adventure/`; labels, symbols, paths, and controls stay in HTML/SVG. Seven additional destination illustrations give the mission collection, interactive homepage atlas, course covers, profile, treasure, and exam entry points more visual variety.
- Motion drives card depth, pointer spotlights, shared artwork, briefing, pixel reveals, selection sparks, actual-total counters, short entrances, and confirmed-result feedback. Ambient scenes pause offscreen and when the tab is hidden. Reduced motion removes tilt, loops, particles, and travel transitions. There is no audio or intro gate.
- Practice celebrates only after the progress API confirms a successful save. Exam effects use the existing submitted session and actual score. No animation moves the questions or formulas.
- React Bits Tilted Card adaptation and license are recorded in `THIRD_PARTY_NOTICES.md`; the pixel treatment is an original Motion implementation.
- Review evidence and verification limits: `design-review/adventure/README.md`.

## Selected Logo

On 29 October 2026 the owner selected concept C, Infinity Atlas. Use its forest/gold mark on light surfaces and reversed gold/cream mark on dark surfaces. The shared BrandMark component owns application rendering; canonical SVG exports live in `public/brand/`. The browser icon, ICO favicon, and Apple home-screen icon use the same symbol. The Math Hunters Association name and existing Thai typography remain unchanged.

### Island simulation atmosphere — 29 October 2026

Exploration scenes use the requested React Bits Gradient ASCII as an emerald/gold glyph layer over original island artwork. The homepage compass and CTA border adapt Circular Text and Star Border. The renderer is lazy loaded, capped at DPR 1 and 30fps, pauses offscreen/hidden, and falls back to static scenery for reduced motion or unsupported WebGL. No sounds or blocking intro. Learning, checkout and admin controls remain steady. Full catalogue decisions: `docs/REACT_BITS_COMPONENT_AUDIT.md`.
