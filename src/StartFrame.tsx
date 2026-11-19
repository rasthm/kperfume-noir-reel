import { AbsoluteFill, Img, staticFile } from "remotion";

// Hailuo start frames: the real product on a black gloss floor with a burgundy backlight.
// Hailuo animates the world around it; if the AI softens the label, the reel lays the real
// cutouts back over the clip at these exact positions.
// A (clip 1, 5s): the bottle alone, large, room around it for the floating notes.
// B (clip 2, 6s): bottle in front of its box, the packshot.
type Placed = { w: number; h: number; left: number; bottom: number };
const K = 0.4;
export const FRAMES: Record<"A" | "B", { floor: number; glow: [number, number]; bottle: Placed; box?: Placed }> = {
  A: { floor: 1580, glow: [50, 46], bottle: { w: 468 * 0.62, h: 2114 * 0.62, left: 540 - (468 * 0.62) / 2, bottom: 1580 } },
  B: {
    floor: 1330,
    glow: [52, 44],
    bottle: { w: 468 * K, h: 2114 * K, left: 300, bottom: 1344 },
    box: { w: 820 * K, h: 2563 * K, left: 520, bottom: 1316 },
  },
};

const Pair: React.FC<{ id: "A" | "B" }> = ({ id }) => {
  const { bottle, box } = FRAMES[id];
  return (
    <>
      {box ? <Img src={staticFile("cut/box.png")} style={{ position: "absolute", width: box.w, left: box.left, top: box.bottom - box.h }} /> : null}
      <Img src={staticFile("cut/bottle.png")} style={{ position: "absolute", width: bottle.w, left: bottle.left, top: bottle.bottom - bottle.h }} />
    </>
  );
};

export const StartFrame: React.FC<{ id: "A" | "B" }> = ({ id }) => {
  const { floor: FLOOR, glow, bottle } = FRAMES[id];
  const cx = ((bottle.left + bottle.w / 2) / 1080) * 100;
  return (
    <AbsoluteFill style={{ background: "#030102" }}>
    {/* burgundy backlight behind the pair, a little amber behind the glass */}
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 48% 30% at ${glow[0]}% ${glow[1]}%, rgba(110,22,30,0.75) 0%, rgba(45,8,14,0.5) 45%, rgba(0,0,0,0) 80%)` }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 14% 16% at ${cx}% ${((bottle.bottom - bottle.h * 0.45) / 1920) * 100}%, rgba(255,150,50,0.22), rgba(0,0,0,0) 80%)` }} />
    {/* gloss floor */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: FLOOR - 40,
        bottom: 0,
        background: "radial-gradient(ellipse 60% 22% at 50% 8%, rgba(70,20,24,0.55), rgba(10,3,5,0.9) 60%, #010001 100%)",
      }}
    />
    {/* reflection */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 1920,
        transform: `translateY(${2 * FLOOR}px) scaleY(-1)`,
        transformOrigin: "top",
        opacity: 0.22,
        WebkitMaskImage: `linear-gradient(to top, rgba(0,0,0,1) ${1920 - FLOOR - 10}px, rgba(0,0,0,0) ${1920 - FLOOR + 260}px)`,
        maskImage: `linear-gradient(to top, rgba(0,0,0,1) ${1920 - FLOOR - 10}px, rgba(0,0,0,0) ${1920 - FLOOR + 260}px)`,
        filter: "blur(1.5px)",
      }}
    >
      <Pair id={id} />
    </div>
    {/* contact shadow */}
    <div
      style={{
        position: "absolute",
        left: cx * 10.8 - 320,
        width: 640,
        top: FLOOR - 26,
        height: 60,
        background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,0,0,0.85), rgba(0,0,0,0) 70%)",
      }}
    />
    <Pair id={id} />
    </AbsoluteFill>
  );
};
