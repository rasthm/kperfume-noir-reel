---
workflow: remotion
aspect: 1080x1920
fps: 30
length: 30s
voice: none (wordless: music + sound effects)
---

# KPerfume NOIR: "Notes of Noir" reel

## Intent
A wordless Instagram reel for KPerfume NOIR (a Kalliyath product). It follows the scent's pyramid:
top notes (cardamom, chestnut, sugar) in warm gold, heart notes (sage, lavender) in dusk light, and
base notes (vanilla, oriental wood, smoke) in black, burgundy and smoke. The smoke wipes into the
spray and the hero shot. The only words on screen are those printed on the product.

## Locked shot list (approved 2026-10-21)
| # | Time | Shot | Source |
|---|---|---|---|
| 1 | 0–2.5 | Amber drop lands on the 2.5s music hit | Hailuo `01-drop` / code |
| 2 | 2.5–5 | Cardamom | Hailuo `02-cardamom` / NOIR label macro |
| 3 | 5–6.25 | Chestnut | Hailuo `03-chestnut` / box texture + embers |
| 4 | 6.25–7.5 | Sugar | Hailuo `04-sugar` / sparkle burst + gold sweep |
| 5 | 7.5–10 | Sage | Hailuo `05-sage` / cap macro + leaves |
| 6 | 10–12.5 | Lavender | Hailuo `06-lavender` / dusk bokeh + petals |
| 7 | 12.5–15 | Bottle rises through petals | real bottle |
| 8 | 15–17.5 | Vanilla | Hailuo `08-vanilla` / liquid macro |
| 9 | 17.5–20 | Oriental wood | Hailuo `09-wood` / box NOIR panel + embers |
| 10 | 20–22.5 | Smoke fills the frame | Hailuo `10-smoke` / canvas smoke |
| 11 | 22.5–25 | Spray on the 22.5s hit | real uncapped bottle + mist (+ `12-mist`) |
| 12 | 25–30 | Hero on the plinth, spotlight closes | real bottle + box (+ `11-pedestal`) |

## Assets
- Photos: `public/photos/WA00*.jpg` (the client's own product shots, 2268×4032)
- Cutouts: `node scripts/cutouts.mjs` → `public/cut/` (measured polygon masks + AI alpha; see the script's comments)
- Audio: `node scripts/gen-sound.mjs` → `public/audio/` (ElevenLabs music + 11 SFX; key in `.env`)
- Hailuo clips: see `HAILUO.md` → `public/clips/`, then `node scripts/scan-clips.mjs`

## Commands
- Preview: `npm run studio`
- Stills: `node scripts/snap.mjs 3.8 14 26`
- Render: `npm run render` → `out/kperfume-noir.mp4`

## Before publishing
- Hailuo clips must come from a paid plan (free = watermark, personal use only).
- Remotion is free for individuals and companies of up to 3 people; 4+ need a company licence.
- ElevenLabs music/SFX: check that the account's plan covers commercial use.
