# Fantasy Football Conquest v8.16

Static GitHub Pages build for the Fantasy Football Conquest board.

## v8.16
- Corrects the hardened renderer so the sea backdrop is composited into the cached world instead of disappearing after the raster cache fades in.
- Keeps the previous good raster visible while a replacement cache is built, eliminating the intentional cache-off/cache-on flash.
- League Pulse is now a six-battle command view: all six matchups are designed to fit at once without the summary-stat cards or a global scoring-feed block.
- Light-theme League Pulse has stronger borders, shadows, and higher-contrast win-probability/control bars.
- Fantasy scoring plays are attached to their own matchup through a tiny lightning control. Hover/focus shows the recent plays in an attached popover; clicking pins/unpins it.
- Scoring-play entries retain the color identity of the fantasy team responsible without making the whole card overly colorful.

Public entry: `index.html`

Commissioner entry: `comish/index.html`
