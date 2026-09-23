# Weekly Chronicle architecture

The weekly Chronicle is a presentation layer over the live League of Olympus application, not a second fantasy-football engine.

## Sources of truth

- League calculations: `index.html` / live Season Center
- Chronicle prose: `chronicles/week-XX.md`
- Historical map: `chronicle-snapshots/week-XX.jpg`
- Preseason map: `chronicle-snapshots/original.jpg`
- Mount Olympus: `chronicle-snapshots/climb-week-XX.jpg`

## Live bridge

`weekly-newsletter-inline.js` runs inside the main application's private closure and exposes:

`window.OlympusWeekBridge.getWeekPackage(week)`

That package is produced by the same Season Center/main-board logic and supplies matchup scores, Weekly Honors/Superlatives, standings, all-play, Hall of Living Legends, and canonical conquest ownership/transfers.

Do not independently recreate fantasy scoring, honors, standings, legends, or conquest calculations in the Chronicle page.

## Newsletter

`weekly-recap.html?week=N` loads the Markdown and static historical screenshots, then loads the main application once in a hidden same-origin iframe and asks the live bridge for Week N data. The visible page renders that package into Chronicle, Conquest, Honors, Standings, and Legends tabs.

## Commissioner workflow

For Week N:

1. Commit `chronicles/week-NN.md`.
2. Upload `chronicle-snapshots/week-NN.jpg`.
3. Upload `chronicle-snapshots/climb-week-NN.jpg`.
4. Open `weekly-recap.html?week=N`.

The WAS image is automatic: Week 1 uses `original.jpg`; later weeks use the prior week's final map.

All scores, honors, standings, all-play, legends, and conquest-ledger data are automatic.

## Legacy files

Older `chronicle-*.js` helpers remain only for rollback/reference. They are not part of the canonical Week 2+ newsletter path and should not receive new newsletter calculations.
