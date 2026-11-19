import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Particles } from "../fx/Particles";
import { Clip, Product, Wash } from "../fx/Finish";

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const PETALS = ["#9b7fd1", "#b79ce6", "#7a5fb8", "#c9b3f0"];

// 5 · Sage (fallback: macro of cap and amber shoulder in cool sage light, leaves drifting down)
export const SageShot: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 85], [0, 1], { easing: ease });
  return (
    <AbsoluteFill style={{ background: "#0a0f0a" }}>
      <Clip
        id="05-sage"
        startFrom={20}
        fallback={
          <AbsoluteFill>
            <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 60% 40%, #2c3a2a, #0a0f0a 70%)" }} />
            <Img
              src={staticFile("cut/bottle.png")}
              style={{
                position: "absolute",
                width: 900,
                left: 90 - p * 30,
                top: -200 - p * 90,
                filter: "saturate(0.85) brightness(1.05)",
              }}
            />
            <Wash color="#8fae86" opacity={0.5} />
          </AbsoluteFill>
        }
      />
      {/* a soft beam of light */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(105deg, rgba(0,0,0,0) 30%, rgba(225,240,210,0.16) 42%, rgba(0,0,0,0) 56%)",
          mixBlendMode: "screen",
        }}
      />
      <Particles kind="leaf" seed="sage-back" count={9} colors={["#7f9a73", "#9db48f", "#5f7a56"]} size={[40, 70]} vy={70} vx={-10} sway={60} blur={2} opacity={0.85} />
      <Particles kind="leaf" seed="sage-front" count={3} colors={["#6d8a62", "#8aa47c"]} size={[120, 170]} vy={110} vx={-20} sway={90} blur={9} opacity={0.75} />
      <Particles kind="dust" seed="sage-dust" count={36} colors={["#e9f2d8", "#c9dcb4"]} size={[1, 2.6]} vy={-10} opacity={0.6} />
    </AbsoluteFill>
  );
};

// 6 · Lavender (fallback: dusk light, soft lavender bokeh, petals lifting on a breeze)
export const LavenderShot: React.FC = () => (
  <AbsoluteFill style={{ background: "#120d1d" }}>
    <Clip
      id="06-lavender"
      startFrom={20}
      fallback={
        <AbsoluteFill>
          <AbsoluteFill style={{ background: "linear-gradient(180deg, #171026 0%, #3d2f5c 55%, #1c1430 100%)" }} />
          <Particles kind="dust" seed="lav-bokeh" count={22} colors={["#b79ce6", "#8a6fc4", "#e0d0ff"]} size={[14, 34]} vy={-12} sway={30} blur={14} opacity={0.5} />
        </AbsoluteFill>
      }
    />
    <Particles kind="petal" seed="lav-back" count={60} colors={PETALS} size={[6, 12]} vy={-80} vx={25} sway={50} blur={1.5} />
    <Particles kind="petal" seed="lav-front" count={8} colors={PETALS} size={[22, 34]} vy={-140} vx={35} sway={70} blur={8} opacity={0.8} />
  </AbsoluteFill>
);

// 7 · First look at the bottle: it rises through floating lavender petals as the light dims
export const RevealShot: React.FC = () => {
  const f = useCurrentFrame();
  const rise = interpolate(f, [0, 60], [260, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const glow = interpolate(f, [10, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #1b1329 0%, #0c0812 70%, #050307 100%)" }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 40% 34% at 50% 52%, rgba(255,170,70,0.28), rgba(0,0,0,0) 70%)",
          opacity: glow,
        }}
      />
      <Particles kind="petal" seed="rev-back" count={46} colors={PETALS} size={[5, 10]} vy={-60} vx={18} sway={40} blur={2.5} opacity={0.8} />
      <Product
        src="cut/bottle.png"
        width={330}
        sweepAt={22}
        sweepDur={42}
        glow="rgba(255,160,60,0.35)"
        style={{ left: 375, top: 215 + rise }}
      />
      <Particles kind="petal" seed="rev-front" count={7} colors={PETALS} size={[24, 36]} vy={-120} vx={30} sway={60} blur={9} opacity={0.75} />
      <Particles kind="dust" seed="rev-dust" count={40} colors={["#f7d27c", "#e8d6ff"]} size={[1, 2.8]} vy={-16} opacity={0.7} />
    </AbsoluteFill>
  );
};
