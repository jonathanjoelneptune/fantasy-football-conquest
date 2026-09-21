from pathlib import Path
import re

page = Path("index.html")
source = Path("weekly-newsletter-inline.js")
s = page.read_text(encoding="utf-8")
inline = source.read_text(encoding="utf-8").rstrip()

if 'data-season-hub-tab="newsletter"' not in s:
    old = '''<button class="screenTab active" data-season-hub-tab="bigboard" type="button">Matchups</button>
        <button class="screenTab" data-season-hub-tab="week" type="button">Weekly Honors</button>'''
    new = '''<button class="screenTab active" data-season-hub-tab="bigboard" type="button">Matchups</button>
        <button class="screenTab" data-season-hub-tab="newsletter" type="button">Weekly Newsletter</button>
        <button class="screenTab" data-season-hub-tab="week" type="button">Weekly Honors</button>'''
    if old not in s:
        raise SystemExit("Season Center tab anchor not found")
    s = s.replace(old, new, 1)

# The old external shim cannot see the main app's private IIFE bindings.
s = re.sub(r'\n*<script src="\./weekly-newsletter\.js\?v=\d+"></script>', '', s)

start = '  // WEEKLY_NEWSLETTER_V820_START'
end = '  // WEEKLY_NEWSLETTER_V820_END'
if start in s and end in s:
    a = s.index(start)
    b = s.index(end, a) + len(end)
    s = s[:a] + inline + s[b:]
else:
    anchor = '    loadSeasonRegistry();loadDynastyRegistry();loadChronicleAwards();'
    if anchor not in s:
        raise SystemExit("Main application initialization anchor not found")
    s = s.replace(anchor, inline + "\n\n" + anchor, 1)

s = s.replace("p.siteVersion='8.19'", "p.siteVersion='8.20'")

if s.count('data-season-hub-tab="newsletter"') != 1:
    raise SystemExit("Expected exactly one Weekly Newsletter tab")
if s.count('WEEKLY_NEWSLETTER_V820_START') != 1:
    raise SystemExit("Expected exactly one internal newsletter route")
if 'weekly-newsletter.js?' in s:
    raise SystemExit("Legacy external newsletter shim still present")

page.write_text(s, encoding="utf-8")
print("Weekly Newsletter integrated inside main application closure.")
