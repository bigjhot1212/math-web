# Third-party component notices

## React Bits treatments

`app/components/adventure/tilt-card.tsx` adapts the pointer-coordinate normalization and layered perspective-card treatment from React Bits Tilted Card by David Haz. Motion handles spring smoothing in this application. The source reference is https://github.com/DavidHDev/react-bits/blob/main/src/ts-tailwind/Components/TiltedCard/TiltedCard.tsx (reviewed 28 October 2026).

Additional treatments reviewed 29 October 2026:

| Treatment | Application | Source |
| Gradient ASCII | Upstream dependency-free WebGL2 renderer, with 30fps cap, DPR 1, live reduced-motion handling, React replay-safe cleanup and context-loss fallback | https://reactbits.dev/r/GradientASCII-TS-TW.json |
| Circular Text | Adapted as a CSS-rotated SVG compass text ring | https://reactbits.dev/text-animations/circular-text |
| Star Border | Adapted as a masked CSS highlight around the practice CTA | https://reactbits.dev/animations/star-border |
|---|---|---|
| Spotlight Card | Pointer-position highlight added to the shared tilt wrapper | https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Components/SpotlightCard/SpotlightCard.tsx |
| Shiny Text | Restrained golden sheen on the hero and license | https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/TextAnimations/ShinyText/ShinyText.tsx |
| Count Up | Actual training totals; static accessible values and reduced-motion fallback | https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/TextAnimations/CountUp/CountUp.tsx |
| Animated Content | Short entrance on the atlas and learning journey | https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Animations/AnimatedContent/AnimatedContent.tsx |
| Click Spark | A brief selection spark inside newly opened illustrations | https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Animations/ClickSpark/ClickSpark.tsx |
| Pixel Transition | Brief image reveal on mission selection | https://reactbits.dev/animations/pixel-transition |

These treatments are compact application-specific adaptations or original implementations inspired by the referenced components, using Motion and CSS rather than adding GSAP or additional animation packages. Gradient ASCII is the explicitly requested exception: its upstream WebGL renderer and option surface are retained, loaded only in exploration scenes. All inherited notices are retained below. The atlas is an original accessible image selector, with native scrolling thumbnails and ordinary topic links.


The React Bits license permits inclusion in applications, including commercial applications, with the notice retained; it restricts selling or redistributing the components themselves. Full license from the upstream repository:

MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell, sublicense, or redistribute the components themselves-whether alone, in a bundle, or as a ported version.**

The same restriction covers the React Bits tools (Background Studio, Texture Lab, Shape Magic, Center Stage, Sound Lab and any tools added later) and the sounds in the sound library. **You may not sell, sublicense, or redistribute the tools or the sounds themselves, or offer the tools or a substantially similar copy of them as a hosted service-whether alone, in a bundle, or as a ported version.**

What you make with the tools is yours to use. You can use exported code, images, videos, and audio files in any personal or commercial application, website, or product, including paid ones. **You may not sell or redistribute the exports on their own, either individually or as the product itself, such as a sound, texture, background, or template pack.**

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
