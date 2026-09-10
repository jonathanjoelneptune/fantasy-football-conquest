# Fantasy Football Conquest v8.17

Static GitHub Pages build for the Fantasy Football Conquest board.

## v8.17
- Reintroduces Focus Battle zoom using the hardened cached renderer instead of mutating the expensive base SVG viewBox.
- The cached world image, territory interaction layer, and live battle/Hero overlay now zoom together as one compositor-safe tactical camera.
- Tactical zoom is deliberately moderate and dynamically sized to keep both territories plus the battle arc visible.
- Focus Battle remains stable on the full rendered island; exiting Focus or returning to League Pulse smoothly restores the strategic view.
- Hero tokens are counter-scaled during Focus so player portraits stay readable without becoming oversized or overlapping excessively.
- Battle line strokes use non-scaling strokes during Tactical Focus so the zoom does not make the fronts unnaturally thick.
- Portrait phones retain the stable full-map Focus behavior; cached desktop and landscape views receive the tactical zoom.

Public entry: `index.html`

Commissioner entry: `comish/index.html`
