# Hailuo clips for the NOIR reel

Generate each clip on hailuoai.video (Create Video → Text to Video), **Hailuo 2.3, 6s, 9:16**.
Save the download into `public/clips/` with the exact filename shown, then run:

```
node scripts/scan-clips.mjs
npm run render
```

Any clip that's missing falls back to the code-built version, so you can add them one at a time.

Add this to the end of every prompt:
> vertical 9:16, pure black background, slow motion, cinematic luxury perfume commercial lighting, no text, no people

| File | Note | Prompt |
|---|---|---|
| `01-drop.mp4` | Hook | Extreme macro: a single golden amber drop falls into a dark amber liquid surface, perfect circular ripple and a small crown splash, warm rim light |
| `02-cardamom.mp4` | Top | Macro: green cardamom pods tumble onto dark slate, one pod splits open revealing black seeds, fine spice dust rises in warm golden side light |
| `03-chestnut.mp4` | Top | Macro: glossy roasted chestnuts on dark wood, one shell cracks open, faint warm steam, glowing ember light from below |
| `04-sugar.mp4` | Top | Macro: a single sugar cube falls and shatters into glittering crystals, crystals catch golden light like sparks |
| `05-sage.mp4` | Heart | Fresh sage leaves drift down slowly through a single soft beam of light, tiny dew drops, muted green tones, shallow depth of field |
| `06-lavender.mp4` | Heart | Lavender sprigs sway gently, small purple petals lift and float upward on a soft breeze, cool dusk light |
| `08-vanilla.mp4` | Base | Macro: a dark vanilla pod slowly splits open revealing tiny black seeds, warm caramel light, a wisp of smoke passes behind |
| `09-wood.mp4` | Base | Dark oud wood chips with glowing ember edges, thin threads of smoke rise and curl, deep amber and burgundy light |
| `10-smoke.mp4` | Base | Thick white incense smoke rises from a small dark bowl and slowly curls to fill the entire frame, backlit |
| `11-pedestal.mp4` | Hero background | Empty dark volcanic rock pedestal in the lower third of frame, tiny glowing amber embers in its cracks, low drifting smoke, burgundy rim light, slow push-in, nothing on top of the rock |
| `12-mist.mp4` | Spray overlay | Fine perfume spray mist bursts from the centre toward the left, tiny droplets backlit gold, no bottle visible |

Shot 7 (the bottle reveal) is always the real bottle, so it has no clip.

**Rules**
- Never ask Hailuo to show the bottle. AI garbles the "NOIR / KPerfume" lettering. The real bottle is composited in Remotion.
- Pick the best of about two tries per clip. Reject anything with text, hands or faces.
- If 9:16 isn't offered for text-to-video, generate a 9:16 still with Create Image and animate it with image-to-video.
- Free downloads carry a watermark and are for personal use only. Download the final clips on a paid plan before posting.
- Use `12-mist.mp4` and `10-smoke.mp4` on pure black: they're blended with "screen", so black becomes transparent.
