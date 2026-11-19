// Generates the ElevenLabs music bed and sound effects into public/audio/.
// Usage: node scripts/gen-sound.mjs [name]   (no arg = all)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = readFileSync(join(root, ".env"), "utf8");
const key = env.match(/^ELEVENLABS_API_KEY=(.+)$/m)?.[1].trim();
if (!key) throw new Error("ELEVENLABS_API_KEY missing from .env");

const SFX = "https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128";
const sfx = (text, duration_seconds, prompt_influence = 0.6) => ({ url: SFX, body: { text, duration_seconds, prompt_influence } });

const JOBS = {
  // v3: the 11s reel. Sections are timed to the cut at 5.0s and the end at 11s.
  music11: {
    url: "https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128",
    body: {
      composition_plan: {
        positive_global_styles: ["luxury perfume commercial", "cinematic", "dark and sensual", "elegant", "instrumental", "96 bpm", "minor key"],
        negative_global_styles: ["vocals", "pop", "EDM drop", "cheerful", "lo-fi"],
        sections: [
          {
            section_name: "Floating notes",
            positive_local_styles: ["airy shimmering pads", "delicate music-box pluck motif", "soft glass chimes", "slowly building tension", "no drums"],
            negative_local_styles: ["drums", "bass"],
            duration_ms: 5000,
            lines: [],
          },
          {
            section_name: "Noir",
            positive_local_styles: ["starts with one deep sub-bass hit", "low cello drone", "slow heavy bass pulse", "smoky and mysterious", "ends on one long resonant low note that rings out"],
            negative_local_styles: ["fast", "bright"],
            duration_ms: 6000,
            lines: [],
          },
        ],
      },
    },
  },
  music: {
    url: "https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128",
    body: {
      prompt:
        "Instrumental luxury perfume commercial score, 96 BPM, dark, sensual and cinematic, no vocals. " +
        "Opens with a deep sub-bass hit and a warm shimmering music-box pluck motif in a minor key with golden bell textures. " +
        "Middle section opens up into airy, breathy synth pads and soft strings, lighter and floating. " +
        "Final section drops lower and darker: slow heavy bass pulse, low cello drone, subtle trip-hop beat, smoky and mysterious, " +
        "building to a rich emotional peak and ending on one long resonant low note that rings out. Elegant, expensive, French noir mood.",
      music_length_ms: 31000,
    },
  },
  drop: sfx("A single liquid drop falling into a dark pool, deep resonant bloop with a soft sub-bass impact, close up, slow motion feel", 2.5),
  crackle: sfx("Dry spice pods cracking open, small crisp crackles and seeds scattering on stone, close up", 2.5),
  crack: sfx("A roasted chestnut shell cracking open, single crisp snap, warm and close", 1.5),
  sparkle: sfx("Sugar cube shattering into tiny glittering crystals, delicate crystalline tinkle and shimmer, magical sparkle", 2),
  breeze: sfx("Soft gentle breeze through leaves, airy and calm, rustle, no birds", 5),
  chime: sfx("A single elegant crystal chime with a long shimmering tail, luxurious", 3),
  swell: sfx("Low warm cinematic riser swell, dark and smooth, building tension", 4),
  ember: sfx("Embers glowing and softly crackling on smoldering wood, intimate close crackle", 3),
  whoosh: sfx("Deep slow cinematic whoosh of thick smoke sweeping past the camera", 2.5),
  spray: sfx("A perfume atomizer spray, one crisp fine mist spritz, close up, clean", 1.2, 0.8),
  boom: sfx("Deep cinematic sub bass boom with a long dark tail, luxury trailer hit", 4),
};

const only = process.argv[2];
mkdirSync(join(root, "public", "audio"), { recursive: true });

await Promise.all(
  Object.entries(JOBS)
    .filter(([name]) => !only || only === name)
    .map(async ([name, job]) => {
      const res = await fetch(job.url, {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify(job.body),
      });
      if (!res.ok) return console.error(`${name}: ${res.status} ${await res.text()}`);
      writeFileSync(join(root, "public", "audio", `${name}.mp3`), Buffer.from(await res.arrayBuffer()));
      console.log(`${name}.mp3`);
    }),
);
