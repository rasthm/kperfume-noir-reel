// Writes src/clips.json listing which Hailuo clips are in public/clips, so each shot
// can play its clip when present and fall back to the code-built version otherwise.
import { readdirSync, writeFileSync } from "node:fs";

const files = readdirSync("public/clips").filter((f) => f.endsWith(".mp4"));
const clips = Object.fromEntries(files.map((f) => [f.replace(/\.mp4$/, ""), `clips/${f}`]));
writeFileSync("src/clips.json", JSON.stringify(clips, null, 2) + "\n");
console.log(Object.keys(clips).length ? Object.keys(clips).join(", ") : "no clips yet (fallbacks in use)");
