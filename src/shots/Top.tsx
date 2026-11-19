import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Particles } from "../fx/Particles";
import { Clip, Wash } from "../fx/Finish";

const ease = Easing.bezier(0.33, 0, 0.2, 1);

// 1 · Hook: an amber drop falls in slow motion and lands on the music's first hit (2.5s)
export const DropShot: React.FC<{ impact: number }> = ({ impact }) => {
  const f = useCurrentFrame();
  const surface = 1240;
  const fall = interpolate(f, [8, impact], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const dropY = -120 + fall * (surface + 120);
  const stretch = 1 + fall * 0.5;
  const since = f - impact;
  return (
    <AbsoluteFill style={{ background: "#050302" }}>
      <Clip
        id="01-drop"
        fallback={
          <AbsoluteFill>
            {/* the dark amber pool */}
            <AbsoluteFill
              style={{
                background:
                  "radial-gradient(ellipse 90% 22% at 50% 66%, rgba(150,78,10,0.55) 0%, rgba(60,26,4,0.35) 45%, rgba(0,0,0,0) 75%)",
              }}
            />
            <svg width={1080} height={1920} style={{ position: "absolute" }}>
              <defs>
                <linearGradient id="drop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffd27a" />
                  <stop offset="0.6" stopColor="#d27a12" />
                  <stop offset="1" stopColor="#7a3a02" />
                </linearGradient>
              </defs>
              {since < 0 ? (
                <g transform={`translate(540 ${dropY}) scale(${2.2 / Math.sqrt(stretch)} ${2.2 * stretch})`}>
                  <path d="M0,-46 C14,-20 30,0 30,18 A30,30 0 0 1 -30,18 C-30,0 -14,-20 0,-46 Z" fill="url(#drop)" />
                  <ellipse cx={-9} cy={8} rx={6} ry={11} fill="#fff6dc" opacity={0.85} />
                </g>
              ) : null}
              {/* ripples and a little crown splash after impact */}
              {since >= 0
                ? [0, 7, 14, 22].map((d, i) => {
                    const k = since - d;
                    if (k < 0) return null;
                    const rx = 20 + k * 14;
                    return (
                      <ellipse
                        key={i}
                        cx={540}
                        cy={surface + 30}
                        rx={rx}
                        ry={rx * 0.2}
                        fill="none"
                        stroke="#ffc766"
                        strokeWidth={3 - i * 0.5}
                        opacity={Math.max(0, 0.9 - k / 34)}
                      />
                    );
                  })
                : null}
              {since >= 0
                ? new Array(26).fill(0).map((_, i) => {
                    const a = Math.PI * (1.08 + random(`cr-${i}`) * 0.84);
                    const v = 9 + random(`cv-${i}`) * 12;
                    const x = 540 + Math.cos(a) * v * since * 1.4;
                    const y = surface + 30 + Math.sin(a) * v * since + 0.55 * since * since;
                    return y < surface + 40 ? (
                      <circle key={i} cx={x} cy={y} r={3 + random(`cs-${i}`) * 4} fill="#ffcf73" opacity={Math.max(0, 1 - since / 24)} />
                    ) : null;
                  })
                : null}
            </svg>
            {/* flash of warm light on impact */}
            <AbsoluteFill
              style={{
                background: "radial-gradient(circle at 50% 66%, rgba(255,190,90,0.5), rgba(0,0,0,0) 45%)",
                opacity: since >= 0 ? Math.max(0, 1 - since / 18) : 0,
              }}
            />
          </AbsoluteFill>
        }
      />
      <Particles kind="dust" seed="drop" count={40} colors={["#f7d27c", "#c99640"]} size={[1.2, 3]} vy={-14} opacity={0.6} />
    </AbsoluteFill>
  );
};

// 2 · Cardamom (fallback: slow pan across the gold-foil NOIR label, spice dust in warm light)
export const CardamomShot: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 85], [0, 1], { easing: ease });
  return (
    <AbsoluteFill style={{ background: "#0b0603" }}>
      <Clip
        id="02-cardamom"
        startFrom={20}
        fallback={
          <AbsoluteFill>
            <Img
              src={staticFile("cut/flatlay.png")}
              style={{
                position: "absolute",
                width: 2600,
                left: -350 + p * 70,
                top: -1180 - p * 60,
                transform: `scale(${1 + p * 0.06}) rotate(${-2 + p * 2}deg)`,
                filter: "brightness(1.05) contrast(1.08) saturate(1.15)",
              }}
            />
            <Wash color="#e0a548" opacity={0.45} />
          </AbsoluteFill>
        }
      />
      <AbsoluteFill style={{ background: "linear-gradient(120deg, rgba(255,200,110,0.22), rgba(0,0,0,0) 45%)", mixBlendMode: "screen" }} />
      <Particles kind="dust" seed="spice" count={70} colors={["#e2bd63", "#b6b45c", "#f6dc93"]} size={[1, 3.4]} vx={22} vy={-18} />
    </AbsoluteFill>
  );
};

// 3 · Chestnut (fallback: the box's diamond texture from the flat lay, lit by ember glow from below)
export const ChestnutShot: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#070302" }}>
      <Clip
        id="03-chestnut"
        startFrom={30}
        fallback={
          <AbsoluteFill>
            <Img
              src={staticFile("cut/flatlay.png")}
              style={{
                position: "absolute",
                width: 3155,
                left: -564 + f * 1.5,
                top: -640 - f * 2,
                filter: "brightness(1.25) contrast(1.15) sepia(0.35)",
              }}
            />
            <AbsoluteFill
              style={{
                background: "radial-gradient(ellipse 80% 45% at 50% 100%, rgba(255,120,30,0.75), rgba(120,40,0,0.25) 50%, rgba(0,0,0,0) 80%)",
                mixBlendMode: "screen",
              }}
            />
          </AbsoluteFill>
        }
      />
      <Particles kind="ember" seed="chest" count={40} colors={["#ff9a3c", "#ffcf7a", "#ff6a1a"]} size={[1.5, 4]} vy={-90} sway={30} />
    </AbsoluteFill>
  );
};

// 4 · Sugar (fallback: a crystal sparkle burst, then a sweep of gold dust carries us out)
export const SugarShot: React.FC = () => {
  const f = useCurrentFrame();
  const burst = interpolate(f, [0, 30], [0.5, 1.35], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const sweep = interpolate(f, [14, 46], [-700, 1300], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  return (
    <AbsoluteFill style={{ background: "#050302" }}>
      <Clip
        id="04-sugar"
        startFrom={40}
        fallback={
          <AbsoluteFill>
            <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,226,170,0.28), rgba(0,0,0,0) 40%)" }} />
            <AbsoluteFill style={{ transform: `scale(${burst})` }}>
              <Particles kind="sparkle" seed="sugar" count={70} colors={["#fff4d6", "#ffd98a", "#ffffff"]} size={[5, 14]} vy={-6} sway={6} area={{ x: 240, y: 660, w: 600, h: 600 }} />
            </AbsoluteFill>
          </AbsoluteFill>
        }
      />
      <AbsoluteFill style={{ transform: `translateX(${sweep}px) rotate(-14deg)` }}>
        <Particles kind="dust" seed="sweep" count={160} colors={["#f7d27c", "#fff0c4", "#c99640"]} size={[1, 4]} vy={0} vx={0} sway={10} area={{ x: 0, y: -200, w: 380, h: 2300 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
