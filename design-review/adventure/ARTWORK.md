# Original artwork and component attribution

Created 28–29 October 2026 using the built-in OpenAI image-generation tool, then saved as WebP assets in `public/adventure/`. The original generated PNGs remain in the Codex generated-images folder. No paid assets, copied anime characters, franchise logos, or existing card designs were used. All titles, mathematical symbols, labels, paths, progress, and controls are HTML/SVG.

| Asset | Original scene | Use |
|---|---|---|
| `island.webp` | Complete three-region floating island | Homepage and mission map |
| `grade4.webp` | Forest settlement | ม.4 region card |
| `grade5.webp` | Observatory and bridges | ม.5 region card |
| `grade6.webp` | Golden sanctuary above clouds | ม.6 region card |
| `archive.webp` | Living-tree library and overlapping lily pools | Sets, logic, license, knowledge library |
| `crystal.webp` | Turquoise crystal sanctuary and reflective lake | Real and complex numbers |
| `curves.webp` | Spiral pavilion, curving aqueducts, terraced pools | Functions, calculus, profile |
| `clockwork.webp` | Astronomical brass-ring tower | Exponentials, sequences, advanced training |
| `geometry.webp` | Geometric workshop on sea cliffs | Conics and matrices |
| `harbour.webp` | Sail towers, wind harbour, suspension bridges | Trigonometry and vectors |
| `celestial.webp` | Celestial garden and armillary observatory | Probability, statistics, exam entry |

The seven expanded destination prompts are preserved verbatim in [art-prompts.json](art-prompts.json). Their shared direction is a detailed hand-painted anime RPG environment with emerald foliage, turquoise water, warm gold, coherent original architecture, and no text, UI, or characters. The first four use the same three-region landscape direction. These are decorative worlds, not mathematical diagrams.

Next Image supplies responsive image sizes and lazy loading. The map and hero prioritise their main landscape; card and thumbnail consumers request smaller responsive images. Scene motion is transform-based.

Seven React Bits treatments inform the implementation: Tilted Card, Pixel Transition, Spotlight Card, Shiny Text, Count Up, Animated Content, and Click Spark. We adapt the treatments to the app with Motion and CSS, retain the source notices, and avoid separate GSAP/WebGL/canvas animation runtimes. Full references and the upstream MIT + Commons Clause notice are in [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md).
