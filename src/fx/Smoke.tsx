import { useEffect, useRef } from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";

// Canvas smoke: soft puffs laid along meandering strands that rise from a source line.
// Strands drift with 2D noise so they curl; puffs widen and fade as they climb.
type Props = {
  seed: string;
  strands: number;
  // source: x range and y of the emitter (frame px)
  x: [number, number];
  y: number;
  // how high the smoke climbs (px)
  rise: number;
  color?: string;
  opacity?: number;
  // grows the puffs, 1 = wisps, 3+ = thick fill
  thickness?: number;
  // seconds before the strand reaches full height
  build?: number;
  blur?: number;
};

export const Smoke: React.FC<Props> = ({
  seed,
  strands,
  x,
  y,
  rise,
  color = "255,255,255",
  opacity = 0.5,
  thickness = 1,
  build = 0,
  blur = 6,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const t = frame / fps;

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    const reach = build > 0 ? Math.min(1, t / build) : 1;
    for (let s = 0; s < strands; s++) {
      const x0 = x[0] + random(`${seed}-x-${s}`) * (x[1] - x[0]);
      const phase = random(`${seed}-p-${s}`) * 100;
      const steps = 110;
      const offset = random(`${seed}-o-${s}`);
      for (let k = 0; k < steps; k++) {
        const u = k / steps;
        if (u > reach) break;
        // puffs flow up the strand over time
        const flow = (u + t * 0.09 + offset) % 1;
        const jitter = (random(`${seed}-j-${s}-${k}`) - 0.5) * 24;
        const h = flow * rise;
        const curl = noise2D(seed, phase + flow * 2.2, t * 0.12) * (40 + flow * 260);
        const px = x0 + curl + noise2D(`${seed}b`, phase, flow * 5 + t * 0.3) * 30 * flow;
        const py = y - h + jitter;
        const r = (34 + flow * 130) * thickness;
        const a = opacity * Math.sin(Math.PI * Math.min(1, flow * 1.15)) * 0.075 * (1 - flow * 0.4);
        if (a <= 0) continue;
        const g = ctx.createRadialGradient(px, py, 0, px, py, r);
        g.addColorStop(0, `rgba(${color},${a})`);
        g.addColorStop(0.5, `rgba(${color},${a * 0.45})`);
        g.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [t, width, height, seed, strands, x, y, rise, color, opacity, thickness, build]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <canvas ref={ref} width={width} height={height} style={{ width, height, filter: `blur(${blur}px)` }} />
    </AbsoluteFill>
  );
};
