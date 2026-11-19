import sharp from "sharp";
const { data, info } = await sharp("public/photos/WA0012.jpg").raw().toBuffer({ resolveWithObject: true });
const W = info.width, C = info.channels;
for (let y = 1240; y <= 2560; y += 40) {
  const yd = (y - 760) / 2, exp = 150 + 2 * (252 + (yd - 250) * 0.093);
  let r = -1;
  for (let x = Math.round(exp + 90); x > exp - 90; x--) {
    const i = (y * W + x) * C;
    if (data[i] > 90 && data[i] > data[i + 2] * 1.6) { r = x; break; }
  }
  console.log(y, Math.round(exp), r);
}
