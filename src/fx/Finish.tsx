import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import clips from "../clips.json";

// Film grain: SVG turbulence re-seeded every frame
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 60} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 60% at 50% 48%, rgba(0,0,0,0) 40%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// Colour wash laid over a shot to set the act's mood
export const Wash: React.FC<{ color: string; opacity: number; mode?: React.CSSProperties["mixBlendMode"] }> = ({
  color,
  opacity,
  mode = "soft-light",
}) => <AbsoluteFill style={{ background: color, opacity, mixBlendMode: mode, pointerEvents: "none" }} />;

// A Hailuo clip from public/clips when it exists (see scripts/scan-clips.mjs), else the fallback
export const hasClip = (id: string) => id in clips;

export const Clip: React.FC<{
  id: string;
  fallback: React.ReactNode;
  startFrom?: number;
  playbackRate?: number;
  blend?: React.CSSProperties["mixBlendMode"];
  style?: React.CSSProperties;
}> = ({ id, fallback, startFrom = 0, playbackRate = 1, blend, style }) => {
  const src = (clips as Record<string, string>)[id];
  if (!src) return <>{fallback}</>;
  return (
    <AbsoluteFill style={{ mixBlendMode: blend }}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={startFrom}
        playbackRate={playbackRate}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
      />
    </AbsoluteFill>
  );
};

// Product cutout with an optional light sweep clipped to its own silhouette
export const Product: React.FC<{
  src: string;
  width: number;
  sweepAt?: number;
  sweepDur?: number;
  glow?: string;
  style?: React.CSSProperties;
}> = ({ src, width, sweepAt, sweepDur = 40, glow, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const file = staticFile(src);
  const p = sweepAt === undefined ? -1 : (frame - sweepAt) / sweepDur;
  return (
    <div style={{ position: "absolute", width, ...style }}>
      <Img
        src={file}
        style={{
          width: "100%",
          display: "block",
          filter: glow ? `drop-shadow(0 0 ${Math.round(fps)}px ${glow})` : undefined,
        }}
      />
      {p > -0.2 && p < 1.2 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            WebkitMaskImage: `url(${file})`,
            WebkitMaskSize: "100% 100%",
            maskImage: `url(${file})`,
            maskSize: "100% 100%",
            background: `linear-gradient(115deg, rgba(255,255,255,0) ${p * 140 - 40}%, rgba(255,240,210,0.55) ${p * 140 - 25}%, rgba(255,255,255,0) ${p * 140 - 10}%)`,
            mixBlendMode: "screen",
          }}
        />
      ) : null}
    </div>
  );
};
