# MK Digital — brand assets

Published brand assets. The web app serves the favicon cut from `/public`
(`favicon-adaptive.svg`, `favicon-mark-{light,dark}.png`) + `src/app/apple-icon.png`; this folder
holds the broader logo / icon / avatar set for reuse and platform uploads.

> The logo is MK Digital's **trademark** — *not* covered by any code license in this repo.
> Work-in-progress / exploration lives privately in `mkdigitalsk/brand`, never here.

## Colours
navy `#0E2A47` · blue `#2F6DB0` · blueLight `#7FB0E0` · teal `#37C2B4` · tealDark `#1796A8`
Identity = "MK == the stack": 3 bars (navy/blue/teal on light · white/blueLight/teal on dark).

## Files
| group | files | use |
|-------|-------|-----|
| lockup | `logo-lockup-{light,dark}.svg` (transparent) · `…-bg.svg` (panel) | header, README, docs |
| mark | `logo-mark-{light,dark}.svg` · `logo-mark-{light,dark}-*.png` (512–4096) | generic logo |
| app icon | `app-icon-{light,dark}.svg` · `…-square.svg` (no rounding) | avatars / app icons |
| avatar (with bg) | `favicon-{light,navy}{,-square}-{512,1024,2048}.png` | platform avatars (upload) |

## Picking a variant
- **light** = dark bars on light bg · **dark** = light bars on dark/navy bg.
- **square** when the platform crops/rounds itself (GitHub, X) — keeps the mark centred.
- **navy bg** = safe universal avatar (bars stay bright on light + dark UIs).

The lockup wordmark is outlined to vector paths (Plus Jakarta Sans 800) — font-independent, not re-editable as text.
