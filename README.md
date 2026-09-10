# Fantasy Football Conquest — v8.14

League-facing single-file GitHub Pages build.

## v8.14 live-game stabilization
- Polls Sleeper matchup scoring about every 1.25 seconds while the page is visible.
- Publishes fantasy score changes to the UI immediately, then enriches the scoring-play explanation asynchronously.
- Refreshes weekly projections every 10 seconds without blocking score updates.
- Moves battle fronts, Tactical Focus, and Battle Heroes into a separate transparent SVG overlay so live animation no longer repaints the static island SVG.
- Keeps battle paths, troops, swords, pips, and Hero nodes persistent; score ticks update attributes instead of rebuilding the battlefield.
- Focus Battle only rewrites static-map emphasis when the selected battle actually changes.
- Keeps the last good live state if a network request is delayed or fails.

The display can only update as quickly as Sleeper publishes the underlying fantasy score, but the site no longer adds a five-second polling delay of its own.

## Deployment
Upload `index.html`, `README.md`, and `comish/index.html` to the repository root/paths and commit to `main`. GitHub Pages should redeploy automatically.
