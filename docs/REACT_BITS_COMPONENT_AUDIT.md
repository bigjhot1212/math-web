# React Bits catalogue audit — 29 October 2026

Read through the configured shadcn MCP using `list_items_in_registries` pages (offset 0 and 1000) and `search_items_in_registries` for ASCII. The live registry returned **1,274 variants / 419 named items**, including **201 sound treatments**. The catalogue has grown beyond the older 100-component lists. All catalogue descriptions were reviewed; this does not claim every component was installed or browser-tested.

## Applied direction

Illustrated emerald simulation world, golden navigation details and parchment mission cards. Ten named React Bits treatments are now used or adapted across the existing experience. Gradient ASCII source was retrieved via the existing shadcn registry CLI after MCP discovery, alongside Circular Text and Star Border source inspection. No new package dependency. WebGL is now permitted only for the explicitly requested ASCII background; Motion remains the app animation engine.

Gradient ASCII runs at DPR 1, without intro, flicker or click bursts. It loads near the viewport, pauses offscreen/hidden, and is omitted under reduced motion. Its ornament is pointer-transparent and aria-hidden. Static scenery/grid remains without WebGL or JavaScript. Checkout/admin/active solving do not import it.

## Complete catalogue decisions

| Item | Decision | Rationale |
|---|---|---|
| AnimatedContent | Applied / adapted | Existing section entrances. |
| BlobCursor | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| ClickSpark | Applied / adapted | Existing illustration-selection sparks. |
| Crosshair | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Cubes | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| ElectricBorder | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| FadeContent | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| GlareHover | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| GradualBlur | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| CrystalizedBall | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| ElectricLogo | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| DitherVeil | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| GlowCursor | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| GhostCursor | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| ImageTrail | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| LogoLoop | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| Magnet | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| MetaBalls | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Strands | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| MetallicPaint | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| Noise | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| PixelTrail | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| PixelTransition | Applied / adapted | Existing Motion illustration reveals. |
| PixelSwap | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Ribbons | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| ShapeBlur | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| SplashCursor | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| StarBorder | Applied / adapted | Adapted as a masked CSS highlight on the main practice CTA. |
| StickerPeel | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| TargetCursor | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| LaserFlow | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| Antigravity | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| OrbitImages | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| ASCIIText | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| BlurText | Deferred | Preserve stable Thai reading and mathematical notation. |
| CircularText | Applied / adapted | Adapted as an SVG compass seal; CSS rotation pauses with the scene. |
| CountUp | Applied / adapted | Existing actual training totals. |
| CurvedLoop | Deferred | Preserve stable Thai reading and mathematical notation. |
| DecryptedText | Deferred | Preserve stable Thai reading and mathematical notation. |
| FallingText | Deferred | Preserve stable Thai reading and mathematical notation. |
| FuzzyText | Deferred | Preserve stable Thai reading and mathematical notation. |
| GlitchText | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| GradientText | Deferred | Preserve stable Thai reading and mathematical notation. |
| RotatingText | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| ScrambledText | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| ScrollFloat | Deferred | Preserve stable Thai reading and mathematical notation. |
| ScrollReveal | Deferred | Preserve stable Thai reading and mathematical notation. |
| ScrollVelocity | Deferred | Preserve stable Thai reading and mathematical notation. |
| ShinyText | Applied / adapted | Existing gold hero and license treatment. |
| SplitText | Deferred | Preserve stable Thai reading and mathematical notation. |
| TextCursor | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| TextPressure | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| TextType | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| TrueFocus | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| VariableProximity | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Shuffle | Deferred | Preserve stable Thai reading and mathematical notation. |
| ParticleText | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| SplitFlapText | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| WarpText | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| TechText | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| StrokeText | Deferred | Preserve stable Thai reading and mathematical notation. |
| DepthText | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| FoldText | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| EchoText | Deferred | Preserve stable Thai reading and mathematical notation. |
| MaskedHeading | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| TextLoop | Deferred | Preserve stable Thai reading and mathematical notation. |
| AnimatedList | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| BounceCards | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| BubbleMenu | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| CardNav | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| CardSwap | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| Carousel | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| ChromaGrid | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| HoloCard | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| CircularCarousel | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| FlexCarousel | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| DepthCarousel | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| AccordionGallery | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| MorphSlider | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| DriftWall | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| CircularGallery | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| Counter | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| DecayCard | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Dock | Deferred | Preserve stable Thai reading and mathematical notation. |
| DomeGallery | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| ElasticSlider | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| FlowingMenu | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| FluidGlass | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| FlyingPosters | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| Folder | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| GlassIcons | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| GlassSurface | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| GooeyNav | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| InfiniteSpiral | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| InfiniteMenu | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| Lanyard | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| MagicBento | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Masonry | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| ModelViewer | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| PillNav | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| PixelCard | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| ProfileCard | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| ScrollStack | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| SpotlightCard | Applied / adapted | Existing pointer highlight on shared tilt wrapper. |
| BorderGlow | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| LineSidebar | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| OptionWheel | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| SpecularButton | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| ElasticMesh | Deferred | Preserve stable Thai reading and mathematical notation. |
| RippleDistortion | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| SwarmCursor | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| HalftoneReveal | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| ScrollExpand | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| CursorGrid | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| CurvedInput | Deferred | Preserve stable Thai reading and mathematical notation. |
| Stack | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| Stepper | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| TiltedCard | Applied / adapted | Existing shared mission and hunter-license perspective wrapper. |
| StaggeredMenu | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| ReflectiveCard | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| PatternWaves | Deferred | Preserve stable Thai reading and mathematical notation. |
| MicroSlats | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| ShapeWaves | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| AeroShards | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| GhostFibers | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| Aurora | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Balatro | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Ballpit | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Beams | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| ColorBends | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| CRTWarp | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| DarkVeil | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Dither | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| DotField | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| DotGrid | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| FaultyTerminal | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Galaxy | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| GradientBlinds | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Lightfall | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| FluxLines | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Ferrofluid | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| MoltenMetal | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| GradientWaves | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| WebThreads | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Topography | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| LightTunnel | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| SlicedWaves | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| AcidSquares | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| Scanner | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| GradientASCII | Applied / adapted | Upstream WebGL renderer: emerald glyph atmosphere; lazy-loaded in exploration scenes. |
| Grainient | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| GridScan | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| GridDistortion | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| GridMotion | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Hyperspeed | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| Iridescence | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| LetterGlitch | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| LightRays | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Lightning | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| LineWaves | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| EvilEye | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| Radar | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| SoftAurora | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| MagicRings | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| LiquidChrome | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Orb | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Particles | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| PixelBlast | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Plasma | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| PlasmaWave | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| Prism | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| PrismaticBurst | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| RippleGrid | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| Silk | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| SideRays | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| ShapeGrid | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Threads | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| Waves | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| MagnetLines | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| LiquidEther | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| FloatingLines | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| LightPillar | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| PixelSnow | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| SquishSwitch | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| HoldButton | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| PeekRating | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| SpringCheck | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| PulseHeart | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| RubberSegment | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| SlideCommit | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| WarmTooltip | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| FuseButton | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| ScrubField | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| LatticeLoader | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| DodgeField | Deferred | Keep the native pointer and touch interaction; avoid another competing cursor effect. |
| CodeSlots | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| WakeSlider | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| CometDial | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| JellyRadio | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| SwipeRow | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| GlideSelect | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| StatusMark | Deferred | Preserve stable Thai reading and mathematical notation. |
| CallChip | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| BellToggle | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| SlingButton | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| SwipeToast | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| PromptBar | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| SloshGauge | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| VoicePill | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| ThoughtLine | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| RefineFrame | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| FolderFloat | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| BranchedMenu | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| FlipCard | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| TearTicket | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| PaperCrumple | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| Shredder | Deferred | Existing controls cover this role; catalogue availability alone does not justify replacing working navigation or learning controls. |
| FlyingButton | Deferred | ASCII and illustrated scenery already fill the ambient role; avoid overlapping GPU scenes. |
| SoundEngine | Deferred | Sound is outside the approved silent experience. |
| SoundPebble | Deferred | Sound is outside the approved silent experience. |
| SoundFelt | Deferred | Sound is outside the approved silent experience. |
| SoundNib | Deferred | Sound is outside the approved silent experience. |
| SoundDew | Deferred | Sound is outside the approved silent experience. |
| SoundBead | Deferred | Sound is outside the approved silent experience. |
| SoundNotch | Deferred | Sound is outside the approved silent experience. |
| SoundHalo | Deferred | Sound is outside the approved silent experience. |
| SoundClasp | Deferred | Sound is outside the approved silent experience. |
| SoundUnclasp | Deferred | Sound is outside the approved silent experience. |
| SoundCheck | Deferred | Sound is outside the approved silent experience. |
| SoundBloom | Deferred | Sound is outside the approved silent experience. |
| SoundCrest | Deferred | Sound is outside the approved silent experience. |
| SoundShrug | Deferred | Sound is outside the approved silent experience. |
| SoundNudge | Deferred | Sound is outside the approved silent experience. |
| SoundChime | Deferred | Sound is outside the approved silent experience. |
| SoundLantern | Deferred | Sound is outside the approved silent experience. |
| SoundPing | Deferred | Sound is outside the approved silent experience. |
| SoundRipple | Deferred | Sound is outside the approved silent experience. |
| SoundSwish | Deferred | Sound is outside the approved silent experience. |
| SoundBreeze | Deferred | Sound is outside the approved silent experience. |
| SoundSweep | Deferred | Sound is outside the approved silent experience. |
| SoundGlide | Deferred | Sound is outside the approved silent experience. |
| SoundKeycap | Deferred | Sound is outside the approved silent experience. |
| SoundChiclet | Deferred | Sound is outside the approved silent experience. |
| SoundThock | Deferred | Sound is outside the approved silent experience. |
| SoundDawn | Deferred | Sound is outside the approved silent experience. |
| SoundDusk | Deferred | Sound is outside the approved silent experience. |
| SoundSeal | Deferred | Sound is outside the approved silent experience. |
| SoundPuff | Deferred | Sound is outside the approved silent experience. |
| SoundPlush | Deferred | Sound is outside the approved silent experience. |
| SoundBoop | Deferred | Sound is outside the approved silent experience. |
| SoundTink | Deferred | Sound is outside the approved silent experience. |
| SoundPluck | Deferred | Sound is outside the approved silent experience. |
| SoundDot | Deferred | Sound is outside the approved silent experience. |
| SoundPetal | Deferred | Sound is outside the approved silent experience. |
| SoundMarble | Deferred | Sound is outside the approved silent experience. |
| SoundDaylight | Deferred | Sound is outside the approved silent experience. |
| SoundNightfall | Deferred | Sound is outside the approved silent experience. |
| SoundRocker | Deferred | Sound is outside the approved silent experience. |
| SoundSpring | Deferred | Sound is outside the approved silent experience. |
| SoundSettle | Deferred | Sound is outside the approved silent experience. |
| SoundShake | Deferred | Sound is outside the approved silent experience. |
| SoundHint | Deferred | Sound is outside the approved silent experience. |
| SoundUndo | Deferred | Sound is outside the approved silent experience. |
| SoundArrive | Deferred | Sound is outside the approved silent experience. |
| SoundCue | Deferred | Sound is outside the approved silent experience. |
| SoundSignal | Deferred | Sound is outside the approved silent experience. |
| SoundTine | Deferred | Sound is outside the approved silent experience. |
| SoundFlick | Deferred | Sound is outside the approved silent experience. |
| SoundUnfold | Deferred | Sound is outside the approved silent experience. |
| SoundFold | Deferred | Sound is outside the approved silent experience. |
| SoundDrawer | Deferred | Sound is outside the approved silent experience. |
| SoundEnter | Deferred | Sound is outside the approved silent experience. |
| SoundErase | Deferred | Sound is outside the approved silent experience. |
| SoundFill | Deferred | Sound is outside the approved silent experience. |
| SoundRelease | Deferred | Sound is outside the approved silent experience. |
| SoundPlug | Deferred | Sound is outside the approved silent experience. |
| SoundUnplug | Deferred | Sound is outside the approved silent experience. |
| SoundEmber | Deferred | Sound is outside the approved silent experience. |
| SoundAdvance | Deferred | Sound is outside the approved silent experience. |
| SoundRetreat | Deferred | Sound is outside the approved silent experience. |
| SoundTab | Deferred | Sound is outside the approved silent experience. |
| SoundLeaf | Deferred | Sound is outside the approved silent experience. |
| SoundDive | Deferred | Sound is outside the approved silent experience. |
| SoundPopover | Deferred | Sound is outside the approved silent experience. |
| SoundPickup | Deferred | Sound is outside the approved silent experience. |
| SoundPlace | Deferred | Sound is outside the approved silent experience. |
| SoundSnap | Deferred | Sound is outside the approved silent experience. |
| SoundShuffle | Deferred | Sound is outside the approved silent experience. |
| SoundHover | Deferred | Sound is outside the approved silent experience. |
| SoundRebound | Deferred | Sound is outside the approved silent experience. |
| SoundStack | Deferred | Sound is outside the approved silent experience. |
| SoundMark | Deferred | Sound is outside the approved silent experience. |
| SoundPulse | Deferred | Sound is outside the approved silent experience. |
| SoundUplink | Deferred | Sound is outside the approved silent experience. |
| SoundDownlink | Deferred | Sound is outside the approved silent experience. |
| SoundSecond | Deferred | Sound is outside the approved silent experience. |
| SoundSummit | Deferred | Sound is outside the approved silent experience. |
| SoundOrbit | Deferred | Sound is outside the approved silent experience. |
| SoundDispatch | Deferred | Sound is outside the approved silent experience. |
| SoundBubble | Deferred | Sound is outside the approved silent experience. |
| SoundEllipsis | Deferred | Sound is outside the approved silent experience. |
| SoundWink | Deferred | Sound is outside the approved silent experience. |
| SoundCallout | Deferred | Sound is outside the approved silent experience. |
| SoundReceipt | Deferred | Sound is outside the approved silent experience. |
| SoundHuddle | Deferred | Sound is outside the approved silent experience. |
| SoundRoll | Deferred | Sound is outside the approved silent experience. |
| SoundHold | Deferred | Sound is outside the approved silent experience. |
| SoundTally | Deferred | Sound is outside the approved silent experience. |
| SoundWrap | Deferred | Sound is outside the approved silent experience. |
| SoundShutter | Deferred | Sound is outside the approved silent experience. |
| SoundSkip | Deferred | Sound is outside the approved silent experience. |
| SoundLevel | Deferred | Sound is outside the approved silent experience. |
| SoundCoin | Deferred | Sound is outside the approved silent experience. |
| SoundGlimmer | Deferred | Sound is outside the approved silent experience. |
| SoundUpgrade | Deferred | Sound is outside the approved silent experience. |
| SoundConfetti | Deferred | Sound is outside the approved silent experience. |
| SoundHeart | Deferred | Sound is outside the approved silent experience. |
| SoundStreak | Deferred | Sound is outside the approved silent experience. |
| SoundTreasure | Deferred | Sound is outside the approved silent experience. |
| SoundAscent | Deferred | Sound is outside the approved silent experience. |
| SoundLift | Deferred | Sound is outside the approved silent experience. |
| SoundGlow | Deferred | Sound is outside the approved silent experience. |
| SoundVelvet | Deferred | Sound is outside the approved silent experience. |
| SoundCushion | Deferred | Sound is outside the approved silent experience. |
| SoundHaze | Deferred | Sound is outside the approved silent experience. |
| SoundGust | Deferred | Sound is outside the approved silent experience. |
| SoundPass | Deferred | Sound is outside the approved silent experience. |
| SoundDrift | Deferred | Sound is outside the approved silent experience. |
| SoundInhale | Deferred | Sound is outside the approved silent experience. |
| SoundExhale | Deferred | Sound is outside the approved silent experience. |
| SoundShimmer | Deferred | Sound is outside the approved silent experience. |
| SoundStardust | Deferred | Sound is outside the approved silent experience. |
| SoundReveal | Deferred | Sound is outside the approved silent experience. |
| SoundTide | Deferred | Sound is outside the approved silent experience. |
| SoundSpiral | Deferred | Sound is outside the approved silent experience. |
| SoundThrottle | Deferred | Sound is outside the approved silent experience. |
| SoundAurora | Deferred | Sound is outside the approved silent experience. |
| SoundSwell | Deferred | Sound is outside the approved silent experience. |
| SoundStrain | Deferred | Sound is outside the approved silent experience. |
| SoundUpswing | Deferred | Sound is outside the approved silent experience. |
| SoundThunder | Deferred | Sound is outside the approved silent experience. |
| SoundSlam | Deferred | Sound is outside the approved silent experience. |
| SoundAnvil | Deferred | Sound is outside the approved silent experience. |
| SoundTimber | Deferred | Sound is outside the approved silent experience. |
| SoundCrystal | Deferred | Sound is outside the approved silent experience. |
| SoundBraam | Deferred | Sound is outside the approved silent experience. |
| SoundDistant | Deferred | Sound is outside the approved silent experience. |
| SoundSwoop | Deferred | Sound is outside the approved silent experience. |
| SoundWhip | Deferred | Sound is outside the approved silent experience. |
| SoundSpin | Deferred | Sound is outside the approved silent experience. |
| SoundTwin | Deferred | Sound is outside the approved silent experience. |
| SoundGale | Deferred | Sound is outside the approved silent experience. |
| SoundSilk | Deferred | Sound is outside the approved silent experience. |
| SoundBackdraft | Deferred | Sound is outside the approved silent experience. |
| SoundRewind | Deferred | Sound is outside the approved silent experience. |
| SoundSlowdown | Deferred | Sound is outside the approved silent experience. |
| SoundWipe | Deferred | Sound is outside the approved silent experience. |
| SoundZoom | Deferred | Sound is outside the approved silent experience. |
| SoundDissolve | Deferred | Sound is outside the approved silent experience. |
| SoundPortal | Deferred | Sound is outside the approved silent experience. |
| SoundDing | Deferred | Sound is outside the approved silent experience. |
| SoundSpark | Deferred | Sound is outside the approved silent experience. |
| SoundWand | Deferred | Sound is outside the approved silent experience. |
| SoundStroke | Deferred | Sound is outside the approved silent experience. |
| SoundGlint | Deferred | Sound is outside the approved silent experience. |
| SoundFocus | Deferred | Sound is outside the approved silent experience. |
| SoundPlunge | Deferred | Sound is outside the approved silent experience. |
| SoundDescent | Deferred | Sound is outside the approved silent experience. |
| SoundSink | Deferred | Sound is outside the approved silent experience. |
| SoundQuake | Deferred | Sound is outside the approved silent experience. |
| SoundFall | Deferred | Sound is outside the approved silent experience. |
| SoundDip | Deferred | Sound is outside the approved silent experience. |
| SoundGravity | Deferred | Sound is outside the approved silent experience. |
| SoundBitflip | Deferred | Sound is outside the approved silent experience. |
| SoundSnow | Deferred | Sound is outside the approved silent experience. |
| SoundData | Deferred | Sound is outside the approved silent experience. |
| SoundScramble | Deferred | Sound is outside the approved silent experience. |
| SoundTracking | Deferred | Sound is outside the approved silent experience. |
| SoundCorrupt | Deferred | Sound is outside the approved silent experience. |
| SoundZap | Deferred | Sound is outside the approved silent experience. |
| SoundPixel | Deferred | Sound is outside the approved silent experience. |
| SoundNebula | Deferred | Sound is outside the approved silent experience. |
| SoundCalm | Deferred | Sound is outside the approved silent experience. |
| SoundDrizzle | Deferred | Sound is outside the approved silent experience. |
| SoundStudio | Deferred | Sound is outside the approved silent experience. |
| SoundHighland | Deferred | Sound is outside the approved silent experience. |
| SoundDeep | Deferred | Sound is outside the approved silent experience. |
| SoundNocturne | Deferred | Sound is outside the approved silent experience. |
| SoundCaption | Deferred | Sound is outside the approved silent experience. |
| SoundAppear | Deferred | Sound is outside the approved silent experience. |
| SoundTickertape | Deferred | Sound is outside the approved silent experience. |
| SoundSlide | Deferred | Sound is outside the approved silent experience. |
| SoundCounter | Deferred | Sound is outside the approved silent experience. |
| SoundBanner | Deferred | Sound is outside the approved silent experience. |
| SoundStamp | Deferred | Sound is outside the approved silent experience. |
| SoundVanish | Deferred | Sound is outside the approved silent experience. |
| SoundCork | Deferred | Sound is outside the approved silent experience. |
| SoundFizz | Deferred | Sound is outside the approved silent experience. |
| SoundBlop | Deferred | Sound is outside the approved silent experience. |
| SoundBalloon | Deferred | Sound is outside the approved silent experience. |
| SoundSprout | Deferred | Sound is outside the approved silent experience. |
| SoundSqueak | Deferred | Sound is outside the approved silent experience. |
| SoundBurble | Deferred | Sound is outside the approved silent experience. |
| SoundHerald | Deferred | Sound is outside the approved silent experience. |
| SoundEmblem | Deferred | Sound is outside the approved silent experience. |
| SoundVerdict | Deferred | Sound is outside the approved silent experience. |
| SoundUplift | Deferred | Sound is outside the approved silent experience. |
| SoundEnigma | Deferred | Sound is outside the approved silent experience. |
| SoundCircuit | Deferred | Sound is outside the approved silent experience. |
| SoundPunchline | Deferred | Sound is outside the approved silent experience. |
| SoundFinale | Deferred | Sound is outside the approved silent experience. |
| SoundHeartbeat | Deferred | Sound is outside the approved silent experience. |
| SoundClockwork | Deferred | Sound is outside the approved silent experience. |
| SoundUnease | Deferred | Sound is outside the approved silent experience. |
| SoundStalk | Deferred | Sound is outside the approved silent experience. |
| SoundSuspense | Deferred | Sound is outside the approved silent experience. |
| SoundDread | Deferred | Sound is outside the approved silent experience. |
| SoundSiren | Deferred | Sound is outside the approved silent experience. |
| SoundCountdown | Deferred | Sound is outside the approved silent experience. |

## Sources and license

- [React Bits MCP](https://reactbits.dev/get-started/mcp)
- [Gradient ASCII](https://reactbits.dev/backgrounds/gradient-ascii)
- Registry source: `https://reactbits.dev/r/GradientASCII-TS-TW.json`
- [Circular Text](https://reactbits.dev/text-animations/circular-text)
- [Star Border](https://reactbits.dev/animations/star-border)

Upstream notices are retained in `THIRD_PARTY_NOTICES.md`. No sounds, copied characters, paid assets, fake rewards or blocking intro.
