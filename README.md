# KPerfume NOIR: "Notes of Noir" reel

A 30-second, wordless 1080×1920 Instagram reel for KPerfume NOIR, made in code with [Remotion](https://remotion.dev). It follows the scent's notes from top to base: cardamom, chestnut and sugar in warm gold; sage and lavender in dusk light; vanilla, wood and smoke in black and burgundy. Then it closes on the spray and a hero shot of the bottle.

The full plan and shot list are in `BRIEF.md`, and the AI clip prompts are in `HAILUO.md`.

## Run it

```bash
npm install
npm run studio     # preview in Remotion Studio
npm run render     # out/kperfume-noir.mp4
```

The audio generation script (`scripts/gen-sound.mjs`) needs an ElevenLabs key in `.env`.

## License

Code: MIT (see `LICENSE`). The brand, product photos, AI clips and audio are not covered; see `NOTICE.md`.
