// Prints left/right foreground edges per row inside an x-window, to fit product silhouettes.
import sharp from "sharp";
const [, , name, x0s, x1s, y0s, y1s, steps] = process.argv;
const [x0, x1, y0, y1, step] = [x0s, x1s, y0s, y1s, steps ?? "40"].map(Number);
const { data, info } = await sharp(`public/photos/${name}.jpg`).raw().toBuffer({ resolveWithObject: true });
const { width: W, channels: C } = info;
const fg = (x, y) => {
  const i = (y * W + x) * C, r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  return (mx ? (mx - mn) / mx : 0) > 0.28 || 0.299 * r + 0.587 * g + 0.114 * b < 0.42;
};
for (let y = y0; y <= y1; y += step) {
  let l = -1, r = -1;
  for (let x = x0; x < x1; x++) if (fg(x, y) && fg(x + 1, y) && fg(x + 2, y)) { l = x; break; }
  for (let x = x1; x > x0; x--) if (fg(x, y) && fg(x - 1, y) && fg(x - 2, y)) { r = x; break; }
  console.log(y, l, r, r - l);
}
