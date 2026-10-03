# Handoff: MathPrep — Refined redesign (Next.js)

## Overview
Visual + UX refresh of the MathPrep site (repo `bigjhot1212/math-web`, branch `master`, deployed at mathprep-iota.vercel.app). Keeps the existing purple/orange palette and Thai fonts but removes generic "AI template" patterns (sparkle badges, glowing blobs, icon-in-rounded-square, three identical cards) and replaces them with real content: real exam questions, real course data, live timers, graph-paper grid textures.

Screens: Home · Practice (topic picker) · Question · Pricing · Exam select · Exam room · Result · Dashboard.

## About the Design Files
`MathPrep Refined.dc.html` is a **design reference built in HTML** — a prototype that shows intended look and behavior. It is NOT production code. Open it in a browser (keep `support.js` next to it); all screens are stacked vertically on one canvas, each labelled above.

The task: **recreate these designs in the existing Next.js 15 App Router + Tailwind + TypeScript codebase**, using its patterns (`app/components/nav.tsx`, `lucide-react`, `react-katex`, existing `/api/*` routes, Supabase auth, `content/questions/*.json`). Wire everything to real data — all numbers in the mock are samples.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, radii, and interactions. Recreate pixel-close, converting inline styles to Tailwind utilities / CSS variables in `app/globals.css`.

## Design Tokens
Add these as CSS variables in `app/globals.css` (Tailwind v4 `@theme` or v3 `theme.extend`).

Colors (oklch):
- `--ink` (text / dark surfaces): `oklch(0.22 0.08 280)`
- `--muted` (secondary text): `oklch(0.48 0.05 280)`
- `--bg` (page): `oklch(0.975 0.012 280)`
- `--surface`: `#ffffff`
- `--line` (borders): `oklch(0.9 0.03 280)`; hairline dividers `oklch(0.93 0.02 280)`
- `--tint` (subtle fills / tracks): `oklch(0.95 0.02 280)`
- `--primary`: `oklch(0.51 0.22 275)`; primary pressed/shadow `oklch(0.4 0.2 275)`; primary soft fill `oklch(0.94 0.04 280)`
- `--accent` (orange CTA): `oklch(0.7 0.19 45)`; accent text `oklch(0.5 0.16 45)`; accent bright (on dark) `oklch(0.78 0.15 45)`; accent soft fill `oklch(0.96 0.03 60)`
- `--good`: `oklch(0.55 0.14 150)` (soft `oklch(0.96 0.04 150)`)
- `--warn`: `oklch(0.65 0.15 70)`
- `--bad`: `oklch(0.58 0.2 27)` (soft `oklch(0.96 0.03 27)`)
- Accuracy scale everywhere: ≥80% good · 60–79% warn · <60% bad

Typography (Google Fonts):
- Headings: **Kanit** 500/600. H1 42px (Home hero 54px/1.22), H2 38px/1.3, card titles 17–20px
- Body: **Sarabun** 400/500/600/700. Body 15–17px, lead 19px/1.7
- Math: **STIX Two Text** (regular + italic) — choices, formulas, big decorative symbols
- Numbers/timers: **JetBrains Mono** 500 — timers, counts, scores

Radius: chips 999px · small buttons 10–12px · buttons/inputs 14–16px · cards 20–24px · big panels 28–32px
Shadows: card hover `0 18px 32px -18px oklch(0.22 0.08 280 / .35)`; primary CTA `0 1px 0 oklch(0.4 0.2 275), 0 8px 20px -8px oklch(0.51 0.22 275 / .6)`
Graph-paper texture: two 1px linear-gradients of `oklch(0.51 0.22 275 / .07)`, `background-size: 36px 36px` (22–24px on course thumbnails with `oklch(1 0 0 / .1)` lines)
Page padding: 56px horizontal, 56–64px top, max content width 1280px (design canvas). Grid gaps 14–20px.

## Screens

### 1. Home — `app/page.tsx`, `app/components/nav.tsx`
- Header 68px: logo (34px purple square, white "∑", Kanit 19px "MathPrep"), segmented nav in `--tint` pill (ฝึกโจทย์ / สอบจำลอง / Dashboard / คอร์สและราคา), primary "เข้าสู่ระบบ" button. Keep the existing cart icon.
- Hero on graph-paper bg (fades out at bottom via mask). 2 columns 1.1fr / 0.9fr. Left: eyebrow with 28px line "ตะลุยโจทย์ A-Level Math 1", H1, lead, two CTAs (primary "ดูคอร์สตะลุยโจทย์ →", white "ลองทำข้อสอบจำลองฟรี"), 3 stats (15 ปี / 30+ ชม. / ไม่หมดอายุ) above a top border.
- Hero right (560px tall, overlapping cards): purple score card "98/100" (96px Kanit) with orange progress bar; white real-question card (ONET 2566 limit question rendered with KaTeX, 4 choices, correct one highlighted, orange "จุดหลอก" note).
- "เรียนแล้วได้อะไร": 3 unequal cards (1.25fr/1fr/1fr): highlighted question text; chapter progress bars; dark card with **live countdown timer** (orange JetBrains Mono 44px + bar).
- "คอร์สที่เปิดแล้ว": 4-col course cards (4:3 colored thumbnail with grid texture + big STIX symbol + zone chip, title, desc, orange price, meta). Data from `content/course-videos.ts`.
- Instructor split panel (purple left / white right with photo placeholder + 01/02/03 list), dark CTA band with orange button.

### 2. Practice — `app/(public)/practice/page.tsx`  ← most recently revised, highest priority
- Header: eyebrow "14 หัวข้อ · ม.4–ม.6", H1 "วันนี้อยากฝึกเรื่องไหน?". Right: **Shuffle button** (dashed orange border, soft orange fill, ⚄ die glyph).
- Row of 2 cards (1fr / 1.15fr):
  - **Continue card** (purple bg, huge faint "∫" watermark bottom-right at 10% white): "ทำต่อจากเมื่อวาน", topic name, chapter, 5-segment progress (orange done / 25% white remaining), white button "ทำข้อที่ N ต่อ →". Data: user's last practice session (`/api/progress`). Hide if none.
  - **Daily question card** (ink bg): header "โจทย์ประจำวัน · {date}" + "ตอบแล้ว X คน · ถูก Y%", question text (KaTeX), 4 choice buttons in a row. On pick → correct turns green, wrong pick turns red, explanation appears. Needs a deterministic daily pick (e.g. hash of date → question from bank) — stats line optional if no backend.
- Filter row: segmented grade tabs (ทั้งหมด / ม.4 / ม.5 / ม.6, each with a colored dot) + search input (320px, "⌕" icon, placeholder "ค้นหา เช่น ลอการิทึม, matrix") filtering by Thai OR English name.
- **Topic grid**, 3 columns, gap 16px, cards min-height 196px, radius 22px, padding 20/22:
  - Each topic gets its own hue, cycling `[275, 45, 190, 350, 150, 240, 20]` by index.
  - Rest: bg `oklch(0.955 0.04 H)`, border 1.5px `oklch(0.9 0.06 H)`, watermark symbol 150px STIX at right:-8 bottom:-34 in `oklch(0.86 0.09 H)`, secondary text `oklch(0.42 0.08 H)`.
  - Content: top row = white grade chip (text `oklch(0.45 0.15 H)`) + "done/total ข้อ" mono; Thai name (Kanit 600 19px) + English (13px); bottom = sample formula (hidden) + 120px progress bar (`oklch(0.55 0.17 H)` on `oklch(0.9 0.05 H)`) + status text (ยังไม่เริ่ม / กำลังฝึก / อีกนิดเดียว ≥80% / ครบแล้ว ✓).
  - **Hover**: bg fills solid `oklch(0.55 0.17 H)`, all text white, bar white on 30% white, watermark 22% white and `rotate(-8deg) scale(1.08)`, card `translateY(-4px)`, colored shadow `0 18px 32px -16px oklch(0.5 0.17 H / .6)`, sample formula fades in (opacity 0→1, translateY 6px→0). Transitions .25s (watermark .4s).
  - **Shuffle**: cycles a highlight through visible cards 12 times with increasing delay (60ms + k·18ms), lands on one. Picked card: orange border + `0 0 0 4px oklch(0.7 0.19 45 / .25)` ring + lift; button label becomes "สุ่มใหม่ · ได้ {topic}". Die rotates 90° per step. Optional: after landing, scroll/focus that card or navigate on second click.
  - Empty search state: dashed box "ไม่พบหัวข้อ “{q}” — ลองพิมพ์ชื่อภาษาอังกฤษดูไหม".
  - Logged-out users: keep current behavior (links go to `/login?next=/practice/{id}`), hide progress/continue card.
- Footer link "ติดตรงไหน? สอบถามพี่ทาง Instagram →" (https://ig.me/m/j.3ra_). The existing floating IG button can remain.
- Topic data (icon, Thai, English, grade, sample formula):
  ∪ เซต Set ม.4 `A ∪ B = {x | x ∈ A ∨ x ∈ B}` · ∧ ตรรกศาสตร์ Logic ม.4 `p → q ≡ ~p ∨ q` · ℝ จำนวนจริง Real Numbers ม.4 `|2x − 3| < 5` · f ความสัมพันธ์และฟังก์ชัน Relations & Functions ม.4 `(f ∘ g)(x) = f(g(x))` · eˣ เอกซ์โพเนนเชียลและลอการิทึม Exponential & Logarithm ม.4 `logₐ(xy) = logₐx + logₐy` · ⊙ เรขาคณิตวิเคราะห์และภาคตัดกรวย Analytic Geometry & Conics ม.4 `(x − h)² + (y − k)² = r²` · △ ฟังก์ชันตรีโกณมิติ Trigonometry ม.5 `sin²θ + cos²θ = 1` · [ ] เมทริกซ์ Matrix ม.5 `det(AB) = det A · det B` · → เวกเตอร์ Vector ม.5 `u · v = |u||v| cos θ` · ℂ จำนวนเชิงซ้อน Complex Numbers ม.5 `i² = −1` · n! หลักการนับเบื้องต้นและความน่าจะเป็น Counting & Probability ม.5 `C(n, r) = n! / r!(n − r)!` · ∑ ลำดับและอนุกรม Sequences & Series ม.6 `Sₙ = n/2 (a₁ + aₙ)` · ∫ แคลคูลัสเบื้องต้น Calculus ม.6 `d/dx xⁿ = nxⁿ⁻¹` · σ สถิติและตัวแปรสุ่ม Statistics & Distributions ม.6 `z = (x − μ) / σ`
  Render sample formulas with KaTeX.

### 3. Question — `app/(public)/practice/[topicId]/page.tsx`
Centered 760px column. Back link + source chip (e.g. ONET 2566) + difficulty chip (orange soft). 5-segment progress (current segment turns green/red after answering). White card radius 28: "ข้อ 1 จาก 5", question (KaTeX, 22px), 5 choice buttons (36px key square + STIX 20px label + right-side mark). After answering: correct → green border/fill/key + "ถูกต้อง"; wrong pick → red + "ยังไม่ใช่"; numbered solution steps panel appears. Wrong answer also shows orange Hint pill in footer. Footer: "ทำใหม่" (reset) + primary "ข้อถัดไป →".

### 4. Pricing — `app/(public)/pricing/pricing-cards.tsx`, `content/course-videos.ts`
Header with eyebrow + H1 "เลือกคอร์สที่อยากเริ่ม" + "เริ่มต้น ฿390 ต่อบท" box. Pill filter tabs (ทุกคอร์ส / คอร์สพิเศษ / ม.6 / ม.5 / ม.4; active = primary fill). Per-zone sections with count ("เปิดแล้ว 3 จาก 3 บท"). ม.6 shows an orange bundle bar (ครบชุด ม.6 ฿1,090, ~~฿1,170~~ ประหยัด ฿80, "ซื้อชุดนี้"). 4-col cards (16:10 thumbnail); available: price + "+ ตะกร้า" toggle (becomes "✓ ในตะกร้า", primary soft) + dark "ซื้อเลย"; unavailable: grey thumbnail, "เร็ว ๆ นี้" chip, "เปิดเร็ว ๆ นี้". Floating dark cart bar bottom-center when cart non-empty: "ตะกร้า N คอร์ส · ฿total" + "ไปที่ตะกร้า". Use existing cart store/`/api/payment/checkout-*`.

### 5. Exam select — `app/(public)/exam/exam-selector.tsx`
2×2 cards: subject (Kanit 24), tier chip (ฟรี green soft / Premium orange soft), topics line, 3 mono stats (ข้อ / นาที / นาที-ต่อ-ข้อ in orange). Free → primary "เริ่มสอบ →"; Premium → orange outline "อัปเกรดเป็น Premium".

### 6. Exam room — `app/(public)/exam/[examId]/page.tsx`
Full-viewport, 72px white header: left "ตอบแล้ว X/15", center timer (JetBrains Mono 32px; ink → amber <5min → red <1min), right "ออกจากข้อสอบ" + primary "ส่งข้อสอบ". 4px time-progress bar under header. Body: 232px sidebar with 4-col question grid (current = primary, answered = `oklch(0.9 0.06 280)` + primary text, empty = white) + legend; main 720px column with question (KaTeX), choices (selected = primary border + soft fill), prev/next (last = "ส่งข้อสอบ"). Submit opens modal: "ยืนยันการส่งข้อสอบ", answered count, orange warning if unanswered, "กลับไปทำต่อ" / "ยืนยันส่ง" → POST `/api/exam/submit` → result page.

### 7. Result — `app/(public)/exam/[examId]/result/page.tsx`
Keep existing scoring logic (MC 3 pts, short-answer 5 pts, `isCorrectAnswer`). Top split panel radius 28: left ink panel — "คะแนนรวม", 104px Kanit percentage colored by scale, label (ยอดเยี่ยม! / ดีแล้ว ฝึกเพิ่มอีกนิดนึง / ต้องฝึกเพิ่มอีก), 3 mono stats (points, correct, duration in orange). Right — topic breakdown sorted weakest first (200px label / bar / "c/n"), orange note "ควรกลับไปเติม: {weakest}". Below: per-question list with segmented filter (ทั้งหมด N / ผิด-ไม่ได้ตอบ M); rows = number, status pill (ถูก green / ผิด red / ไม่ได้ตอบ grey), truncated question, points "3/3", caret; click expands: full question (KaTeX), your answer vs. key, topic, "ฝึกโจทย์ “{topic}” เพิ่ม →". Footer: "สอบอีกครั้ง" + primary "ฝึกโจทย์ตามหัวข้อ →".

### 8. Dashboard — `app/(auth)/dashboard/page.tsx`
Greeting + H1 "ความก้าวหน้าของคุณ" + two buttons. One card split in 3 (dividers): questions done, accuracy (warn color) with "179/248 ข้อถูก", streak with 7 day squares (orange = active). Row: 14-day accuracy bar chart (bars colored by scale, 25% gridlines, legend) + "หัวข้อที่ต้องฝึกเพิ่ม" (5 weakest, colored bars, link "ฝึก “{first}” ต่อ →"). Row: exam history table (name, date, score mono, % colored) + "หัวข้อที่ทำได้ดี" (green bars). Data from `/api/progress` and exam sessions.

## Interactions & Motion
- Hover lifts: `translateY(-4px)`, .25s ease. No keyframe animations except timers.
- Timers tick every 1s.
- All math via `react-katex` (`InlineMath`, existing `renderText` `$...$` splitter) — the mock uses Unicode placeholders.
- Responsive: designs are drawn at 1280px. Collapse grids → 2 cols ≤1024px, 1 col ≤640px; hero stacks; exam sidebar becomes a top horizontal scroller on mobile. Min tap target 44px.

## State (Practice page)
`grade: 'all'|'ม.4'|'ม.5'|'ม.6'`, `query: string`, `hoveredId` (CSS :hover is fine instead), `pickedId`, `rolling: boolean`, `dailyChoice: number|null`. Server data: topic progress `{topicId: {done,total}}`, last session, daily question.

## Assets
No image assets. Instructor photo is a placeholder (striped box) — use the real photo. Symbols are Unicode glyphs in STIX Two Text.

## Files
- `MathPrep Refined.dc.html` — the design (all 8 screens). Open in a browser with `support.js` beside it.
