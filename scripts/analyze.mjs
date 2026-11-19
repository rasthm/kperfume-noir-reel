// Rough foreground mask (saturated or dark pixels vs the light studio backdrop) for measuring product edges.
import sharp from "sharp";
const [, , name] = process.argv;
const src = `public/photos/${name}.jpg`;
const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const mask = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) {
  const r = data[i * C] / 255, g = data[i * C + 1] / 255, b = data[i * C + 2] / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const sat = mx === 0 ? 0 : (mx - mn) / mx;
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  mask[i] = sat > 0.28 || luma < 0.42 ? 255 : 0;
}
await sharp(mask, { raw: { width: W, height: H, channels: 1 } }).resize(Math.round(W / 4)).png().toFile(`work/${name}-mask.png`);
// Column profile in row bands
const band = (y0, y1) => {
  const cols = [];
  for (let x = 0; x < W; x++) {
    let n = 0;
    for (let y = y0; y < y1; y++) if (mask[y * W + x]) n++;
    cols.push(n / (y1 - y0));
  }
  const runs = []; let s = -1;
  cols.forEach((v, x) => { if (v > 0.6 && s < 0) s = x; if ((v <= 0.6 || x === W - 1) && s >= 0) { if (x - s > 20) runs.push([s, x]); s = -1; } });
  return runs;
};
for (let y = 0; y < H; y += 200) console.log(y, JSON.stringify(band(y, y + 200)));
