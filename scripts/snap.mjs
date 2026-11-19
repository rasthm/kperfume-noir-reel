// Renders review stills at the given seconds into snaps/, bundling once.
// Usage: node scripts/snap.mjs 1.5 4 6.8 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const times = process.argv.slice(2).map(Number);
mkdirSync("snaps", { recursive: true });
const serveUrl = await bundle({ entryPoint: resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "NoirReel" });
for (const t of times) {
  const frame = Math.round(t * composition.fps);
  const output = `snaps/t${t.toFixed(2).padStart(5, "0")}.jpg`;
  await renderStill({ serveUrl, composition, frame, output, imageFormat: "jpeg", jpegQuality: 85 });
  console.log(output);
}
