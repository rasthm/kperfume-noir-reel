import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";

// Deterministic drifting particles: gold dust, spice dust, embers, petals, leaves, sparkles.
// Each particle wraps around its travel so the field never empties.
export type ParticleKind = "dust" | "ember" | "petal" | "leaf" | "sparkle";

type Props = {
  kind: ParticleKind;
  seed: string;
  count: number;
  colors: string[];
  size: [number, number];
  // pixels per second; negative vy rises
  vx?: number;
  vy?: number;
  opacity?: number;
  blur?: number;
  sway?: number;
  // emit from a box instead of the whole frame
  area?: { x: number; y: number; w: number; h: number };
};

export const Particles: React.FC<Props> = ({
  kind,
  seed,
  count,
  colors,
  size,
  vx = 0,
  vy = -30,
  opacity = 1,
  blur = 0,
  sway = 20,
  area,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  const box = area ?? { x: -60, y: -60, w: width + 120, h: height + 120 };

  return (
    <AbsoluteFill style={{ pointerEvents: "none", filter: blur ? `blur(${blur}px)` : undefined, opacity }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id={`g-${seed}`}>
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {new Array(count).fill(0).map((_, i) => {
          const r = (k: string) => random(`${seed}-${i}-${k}`);
          const speed = 0.6 + r("s") * 0.8;
          const px = (r("x") * box.w + vx * speed * t + Math.sin(t * (0.6 + r("w")) + r("p") * 6.28) * sway) % box.w;
          const py = (r("y") * box.h + vy * speed * t) % box.h;
          const x = box.x + (px < 0 ? px + box.w : px);
          const y = box.y + (py < 0 ? py + box.h : py);
          const sz = size[0] + r("z") * (size[1] - size[0]);
          const color = colors[Math.floor(r("c") * colors.length)];
          const twinkle = 0.55 + 0.45 * Math.sin(t * (2 + r("tw") * 4) + r("ph") * 6.28);
          const rot = r("rot") * 360 + t * (r("rs") - 0.5) * 120;
          if (kind === "dust" || kind === "ember") {
            return (
              <g key={i} opacity={twinkle}>
                <circle cx={x} cy={y} r={sz * 2.6} fill={color} opacity={kind === "ember" ? 0.35 : 0.18} />
                <circle cx={x} cy={y} r={sz} fill={color} />
              </g>
            );
          }
          if (kind === "sparkle") {
            const s = sz * (0.4 + 0.6 * twinkle);
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${rot / 4})`} opacity={twinkle}>
                <path d={`M0,${-s * 3} L${s * 0.35},0 L0,${s * 3} L${-s * 0.35},0 Z`} fill={color} />
                <path d={`M${-s * 3},0 L0,${s * 0.35} L${s * 3},0 L0,${-s * 0.35} Z`} fill={color} />
                <circle r={s * 0.7} fill="#fff" />
              </g>
            );
          }
          if (kind === "petal") {
            return (
              <ellipse
                key={i}
                cx={0}
                cy={0}
                rx={sz * 0.55}
                ry={sz}
                fill={color}
                opacity={0.85}
                transform={`translate(${x} ${y}) rotate(${rot}) scale(${0.6 + 0.4 * Math.abs(Math.sin(t * 2 + i))} 1)`}
              />
            );
          }
          // leaf
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${sz / 40})`}>
              <path d="M0,-40 C22,-22 22,22 0,40 C-22,22 -22,-22 0,-40 Z" fill={color} />
              <path d="M0,-38 L0,38" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
