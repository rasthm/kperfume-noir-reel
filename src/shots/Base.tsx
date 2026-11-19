import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Particles } from "../fx/Particles";
import { Smoke } from "../fx/Smoke";
import { Mist } from "../fx/Mist";
import { Clip, Product, Wash, hasClip } from "../fx/Finish";

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const EMBERS = ["#ff9a3c", "#ffcf7a", "#ff6a1a"];

// 8 · Vanilla (fallback: macro through the amber liquid in caramel light, a wisp of smoke behind)
export const VanillaShot: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 85], [0, 1], { easing: ease });
  return (
    <AbsoluteFill style={{ background: "#0d0703" }}>
      <Clip
        id="08-vanilla"
        startFrom={20}
        fallback={
          <AbsoluteFill>
            <Smoke seed="van" strands={3} x={[200, 900]} y={2000} rise={2200} opacity={0.35} />
            <Img
              src={staticFile("cut/open.png")}
              style={{
                position: "absolute",
                width: 1500,
                left: -210 + p * 40,
                top: -720 - p * 110,
                transform: `rotate(${5 - p * 2}deg)`,
                filter: "brightness(0.95) contrast(1.12) saturate(1.1)",
              }}
            />
            <Wash color="#c8823a" opacity={0.5} />
          </AbsoluteFill>
        }
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(0,0,0,0) 40%, rgba(10,4,0,0.8) 100%)" }} />
      <Particles kind="dust" seed="van-dust" count={34} colors={["#f2c27a", "#ffe2b0"]} size={[1, 2.8]} vy={-12} opacity={0.7} />
    </AbsoluteFill>
  );
};

// 9 · Oriental wood (fallback: the box's NOIR panel in low ember light, smoke threads rising)
export const WoodShot: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 85], [0, 1], { easing: ease });
  return (
    <AbsoluteFill style={{ background: "#070203" }}>
      <Clip
        id="09-wood"
        startFrom={20}
        fallback={
          <AbsoluteFill>
            <Img
              src={staticFile("cut/box.png")}
              style={{
                position: "absolute",
                width: 1700,
                left: -310,
                top: -2640 + p * 120,
                transform: `scale(${1.04 - p * 0.04})`,
                filter: "brightness(0.85) contrast(1.15)",
              }}
            />
            <AbsoluteFill
              style={{
                background: "radial-gradient(ellipse 90% 40% at 50% 105%, rgba(255,110,30,0.55), rgba(90,20,10,0.2) 55%, rgba(0,0,0,0) 80%)",
                mixBlendMode: "screen",
              }}
            />
          </AbsoluteFill>
        }
      />
      <Smoke seed="wood" strands={5} x={[120, 960]} y={2000} rise={2300} opacity={0.5} />
      <Particles kind="ember" seed="wood-emb" count={46} colors={EMBERS} size={[1.4, 3.6]} vy={-110} sway={36} />
    </AbsoluteFill>
  );
};

// 10 · Smoke rises and fills the frame — it wipes us into the finale
export const SmokeShot: React.FC = () => (
  <AbsoluteFill style={{ background: "#030102" }}>
    <Clip
      id="10-smoke"
      startFrom={10}
      fallback={<Smoke seed="incense" strands={24} x={[60, 1020]} y={2050} rise={2600} thickness={1.3} build={1.8} opacity={0.75} blur={4} color="225,212,200" />}
    />
    {hasClip("10-smoke") ? null : (
      <Smoke seed="incense-2" strands={10} x={[100, 980]} y={2100} rise={2400} thickness={2.6} build={2.4} opacity={0.32} blur={18} color="200,180,170" />
    )}
  </AbsoluteFill>
);

// 11 · The spray, on the music's second big hit
export const SprayShot: React.FC = () => {
  const f = useCurrentFrame();
  const push = interpolate(f, [0, 85], [1, 1.05]);
  // nozzle orifice of open.png once placed and rotated as below (measured from the cutout)
  const nozzle = { x: 558, y: 413 };
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 55% at 55% 45%, #3a0d14 0%, #14050a 55%, #000 100%)" }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "55% 40%" }}>
        <Product
          src="cut/open.png"
          width={520}
          sweepAt={28}
          sweepDur={40}
          glow="rgba(255,150,60,0.3)"
          style={{ left: 380, top: 280, transform: "rotate(5deg)" }}
        />
        <Mist x={nozzle.x} y={nozzle.y} angle={Math.PI + 0.1} at={2} />
      </AbsoluteFill>
      <Clip id="12-mist" blend="screen" fallback={null} />
      <Particles kind="dust" seed="spray-dust" count={40} colors={["#f7d27c", "#ffe9bf"]} size={[1, 3]} vy={-14} opacity={0.7} />
    </AbsoluteFill>
  );
};

// 12–13 · Hero: bottle and box on a dark ember-lit plinth, smoke curling; the light closes to black
export const HeroShot: React.FC = () => {
  const f = useCurrentFrame();
  const push = interpolate(f, [0, 150], [1, 1.09], { easing: Easing.inOut(Easing.sin) });
  const spot = interpolate(f, [92, 140], [1500, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const out = interpolate(f, [138, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const k = 0.52; // shared scale: both cutouts come from the same photo
  const top = 1440;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 62%" }}>
        <Clip
          id="11-pedestal"
          fallback={
            <AbsoluteFill>
              <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 50% at 50% 55%, #2a0a10 0%, #10040a 55%, #000 100%)" }} />
              {/* plinth */}
              <svg width={1080} height={1920} style={{ position: "absolute" }}>
                <defs>
                  <linearGradient id="side" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#050203" />
                    <stop offset="0.45" stopColor="#1d1012" />
                    <stop offset="1" stopColor="#030102" />
                  </linearGradient>
                  <radialGradient id="topface" cx="0.5" cy="0.4" r="0.7">
                    <stop offset="0" stopColor="#2b1a17" />
                    <stop offset="1" stopColor="#0b0506" />
                  </radialGradient>
                </defs>
                <rect x={110} y={top} width={860} height={600} fill="url(#side)" />
                <ellipse cx={540} cy={top} rx={430} ry={70} fill="url(#topface)" />
                <ellipse cx={540} cy={top} rx={430} ry={70} fill="none" stroke="rgba(255,140,60,0.35)" strokeWidth={2} />
              </svg>
            </AbsoluteFill>
          }
        />
        <Smoke seed="hero-back" strands={6} x={[150, 930]} y={top + 40} rise={1500} opacity={0.4} />
        {/* reflections on the plinth top */}
        <div style={{ position: "absolute", left: 0, top: top - 20, width: 1080, height: 120, overflow: "hidden", opacity: 0.16 }}>
          <Img src={staticFile("cut/box.png")} style={{ position: "absolute", width: 820 * k, left: 410, top: 20, transform: "scaleY(-1)", transformOrigin: "top" }} />
          <Img src={staticFile("cut/bottle.png")} style={{ position: "absolute", width: 468 * k, left: 240, top: 36, transform: "scaleY(-1)", transformOrigin: "top" }} />
        </div>
        <Product src="cut/box.png" width={820 * k} sweepAt={34} sweepDur={50} style={{ left: 410, top: top - 2563 * k + 10 }} />
        <Product
          src="cut/bottle.png"
          width={468 * k}
          sweepAt={20}
          sweepDur={46}
          glow="rgba(255,160,60,0.35)"
          style={{ left: 240, top: top - 2114 * k + 36 }}
        />
        <Particles kind="ember" seed="hero-emb" count={26} colors={EMBERS} size={[1.2, 3]} vy={-40} sway={20} area={{ x: 120, y: 1300, w: 840, h: 600 }} />
        <Smoke seed="hero-front" strands={4} x={[80, 1000]} y={top + 160} rise={900} opacity={0.35} blur={12} />
      </AbsoluteFill>
      <Particles kind="dust" seed="hero-dust" count={40} colors={["#f7d27c", "#ffe9bf"]} size={[1, 2.6]} vy={-12} opacity={0.6} />
      {/* spotlight closes on the bottle */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 34% 50%, rgba(0,0,0,0) ${spot * 0.55}px, rgba(0,0,0,1) ${spot}px)`,
        }}
      />
      <AbsoluteFill style={{ background: "#000", opacity: out }} />
    </AbsoluteFill>
  );
};
