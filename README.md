# Fantasy Football Conquest — v8.13

League-facing single-file GitHub Pages build.

## v8.13 rendering refactor
- Keeps the island/base map as a stable stage during live polling.
- Uses persistent keyed battle-front SVG groups instead of replacing the whole battle layer on score changes.
- Uses persistent keyed Hero nodes that move between territory staging points rather than being recreated.
- Focus Battle no longer filters/repaints every territory; a single tactical veil dims the static stage.
- Focused Heroes are distributed across the two territories and only relevant starters are shown: mustering, active, surging, and meaningful spent players.
- D/ST remains inside its own territory.
- All Battles shows at most one currently relevant Hero per matchup, and no pregame Hero until a player is actually mustering.
- League Pulse was simplified and enlarged for readability.
- Returning to League Pulse restores the full strategic battlefield.

## Deployment
Upload `index.html`, `README.md`, and `comish/index.html` to the repository root/paths and commit to `main`. GitHub Pages should redeploy automatically.
