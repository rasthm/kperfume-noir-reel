import { useEffect, useRef } from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";

// Perfume spray: a burst of fine droplets in a cone from the nozzle plus a soft cloud that
// blooms and hangs. Starts at `at` (frames, local to the parent sequence).
type Props = { x: number; y: number; angle: number; at: number; seed?: string };

export const Mist: React.FC<Props> = ({ x, y, angle, at, seed = "mist" }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const t = (frame - at) / fps;

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    if (t < 0) return;
    ctx.globalCompositeOperation = "lighter";
    // Cloud
    const cloudR = 90 + 420 * (1 - Math.exp(-t * 1.3));
    const cd = 90 + 230 * (1 - Math.exp(-t * 1.4));
    const cx = x + Math.cos(angle) * cd;
    const cy = y + Math.sin(angle) * cd - t * 30;
    const ca = 0.34 * Math.min(1, t * 6) * Math.exp(-t * 0.4);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cloudR);
    g.addColorStop(0, `rgba(255,236,200,${ca})`);
    g.addColorStop(0.6, `rgba(255,214,150,${ca * 0.4})`);
    g.addColorStop(1, "rgba(255,214,150,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, cloudR, 0, Math.PI * 2);
    ctx.fill();
    // Droplets: emitted during the first 0.35s, then fly out and slow down
    for (let i = 0; i < 1400; i++) {
      const birth = random(`${seed}-b-${i}`) * 0.35;
      const age = t - birth;
      if (age < 0) continue;
      const spread = (random(`${seed}-a-${i}`) - 0.5) * 0.55;
      const sp = 380 + random(`${seed}-v-${i}`) * 900;
      const dist = (sp / 2.2) * (1 - Math.exp(-age * 2.2));
      const a = angle + spread;
      const px = x + Math.cos(a) * dist;
      const py = y + Math.sin(a) * dist + age * age * 40 - age * 20;
      const life = Math.exp(-age * 0.7);
      const r = 0.8 + random(`${seed}-r-${i}`) * 2.2;
      ctx.fillStyle = `rgba(255,${200 + Math.floor(random(`${seed}-c-${i}`) * 55)},170,${0.75 * life})`;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [t, width, height, x, y, angle, seed]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <canvas ref={ref} width={width} height={height} style={{ width, height }} />
    </AbsoluteFill>
  );
};
