# Fantasy Football Conquest — v8.15

League-facing single-file GitHub Pages build.

## v8.15 hardened renderer
- Keeps the near-real-time Sleeper score cadence while reducing unnecessary UI work.
- Adds a compositor-cached static world snapshot for normal desktop live viewing. The 72-territory island is no longer the surface that repaints when the mouse moves or a fantasy score changes.
- Adds a dedicated lightweight territory interaction SVG with one reusable hover outline instead of filters/brightness/drop-shadows on province paths.
- Freezes indefinite decorative sea/wave animation during normal live play and strips expensive static-map SVG filters where they do not materially improve readability.
- Keeps the existing isolated live SVG for battle lines, armies, swords, focus effects and Battle Heroes.
- Focus Battle no longer changes classes/opacity/filter state across the base island; it is now overlay-only.
- Coalesces visible UI mutations into a single animation frame and skips expensive Big Board, League Pulse, War Correspondent and Hero DOM work when those screens are not visible.
- Pauses live SVG animation while the browser tab is hidden and backs hidden polling off to 8 seconds; returning to the page immediately resynchronizes.
- Preserves manual desktop pan/zoom through the interaction layer and rebuilds the cached world only after a camera gesture settles.

The goal of v8.15 is stability rather than new features: the map is the stage, and the war happens above it.

## Deployment
Upload `index.html`, `README.md`, and `comish/index.html` to the repository root/paths and commit to `main`. GitHub Pages should redeploy automatically.
