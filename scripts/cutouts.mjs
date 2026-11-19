// Cuts the product out of the studio photos into public/cut/*.png.
// The AI background remover misses the amber glass on white, so the straight-on bottle and box
// use measured polygon masks (edges from scripts/edges.mjs). Clear glass that only shows the white
// backdrop is luma-keyed out so it reads as glass on a dark set.
// Usage: node scripts/cutouts.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public/cut", { recursive: true });
const W = 2268, H = 4032;

const svgMask = (d, blur = 1.2) =>
  sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${d}" fill="#fff"/></svg>`))
    .blur(blur)
    .extractChannel(0)
    .raw()
    .toBuffer();

const rrect = (x0, y0, x1, y1, rTop, rBot) =>
  `M${x0 + rTop},${y0} H${x1 - rTop} Q${x1},${y0} ${x1},${y0 + rTop} V${y1 - rBot} Q${x1},${y1} ${x1 - rBot},${y1} H${x0 + rBot} Q${x0},${y1} ${x0},${y1 - rBot} V${y0 + rTop} Q${x0},${y0} ${x0 + rTop},${y0} Z`;

const JOBS = {
  // WA0014, straight-on capped bottle: cap 693–1046 (y 1424–1960), glass body 676–1070 (y 1960–3462)
  bottle: {
    src: "WA0014",
    path: rrect(697, 1427, 1043, 1975, 38, 0) + " " + rrect(681, 1962, 1066, 3458, 14, 46),
    glassKey: true,
  },
  // WA0014 box, slight perspective lean
  box: {
    src: "WA0014",
    path: "M1402,830 L2072,826 L2101,900 L2093,3292 L2078,3306 L1416,3306 L1399,3292 L1364,900 Z",
  },
  // WA0012 uncapped bottle: AI cutout clipped along the traced glass edges so the box behind is dropped
  open: {
    src: "WA0012",
    ai: "work/WA0012-cut.png",
    path: (() => {
      const xr = (y) => Math.round(661 + 0.11 * (y - 1400) + 3);
      const xl = (y) => Math.round(252 + 0.194 * (y - 1360) - 3);
      return `M230,700 L720,700 L720,1250 L${xr(1250)},1250 L${xr(2420)},2420 L742,2468 L600,2496 L${xl(2470)},2492 L${xl(1360)},1360 L230,1250 Z`;
    })(),
    glassKey: true,
  },
  // WA0008 flat lay (bottle on box): the AI cutout is clean here
  flatlay: { src: "WA0008", ai: "work/WA0008-cut.png" },
};

for (const [name, job] of Object.entries(JOBS)) {
  const { data: rgb } = await sharp(`public/photos/${job.src}.jpg`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = W * H;
  const alpha = Buffer.alloc(n, 255);
  if (job.path) {
    const m = await svgMask(job.path);
    for (let i = 0; i < n; i++) alpha[i] = m[i];
  }
  if (job.ai) {
    const a = await sharp(job.ai).ensureAlpha().extractChannel(3).raw().toBuffer();
    for (let i = 0; i < n; i++) alpha[i] = Math.round((alpha[i] * a[i]) / 255);
  }
  if (job.glassKey) {
    // Bright, unsaturated pixels are backdrop seen through clear glass: fade them out
    for (let i = 0; i < n; i++) {
      const r = rgb[i * 3] / 255, g = rgb[i * 3 + 1] / 255, b = rgb[i * 3 + 2] / 255;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const sat = mx ? (mx - mn) / mx : 0;
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      const k = Math.min(1, Math.max(0, (luma - 0.6) / 0.3)) * Math.min(1, Math.max(0, (0.22 - sat) / 0.14));
      alpha[i] = Math.round(alpha[i] * (1 - 0.85 * k));
    }
  }
  const rgba = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    rgba[i * 4] = rgb[i * 3];
    rgba[i * 4 + 1] = rgb[i * 3 + 1];
    rgba[i * 4 + 2] = rgb[i * 3 + 2];
    rgba[i * 4 + 3] = alpha[i];
  }
  const img = sharp(rgba, { raw: { width: W, height: H, channels: 4 } });
  // Trim to the alpha bounds plus a margin
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (alpha[y * W + x] > 16) {
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  const m = 40;
  const left = Math.max(0, x0 - m), top = Math.max(0, y0 - m);
  const width = Math.min(W, x1 + m) - left, height = Math.min(H, y1 + m) - top;
  await img.extract({ left, top, width, height }).png().toFile(`public/cut/${name}.png`);
  console.log(`${name}.png ${width}x${height} (from ${left},${top})`);
}
