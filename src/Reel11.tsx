import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FRAMES } from "./StartFrame";

// v3: the 11-second reel. Two Hailuo H3 clips generated from the start frames in StartFrame.tsx:
// A (0–5s) the notes float around the bottle, B (5–11s) smoke and base notes on the packshot.
// Hard cut at 5.0s on the music's bass hit. Camera moves happen here, on the clip and any
// real-product overlay together, so the two stay aligned.
export const REEL11 = { fps: 30, total: 330, cut: 150 };

type Props = { overlayA: boolean; overlayB: boolean; clipVolume: number };

// The real cutout at its start-frame position (used if Hailuo softens the label)
const RealProduct: React.FC<{ id: "A" | "B" }> = ({ id }) => {
  const { bottle, box } = FRAMES[id];
  return (
    <>
      {box ? <Img src={staticFile("cut/box.png")} style={{ position: "absolute", width: box.w, left: box.left, top: box.bottom - box.h }} /> : null}
      <Img src={staticFile("cut/bottle.png")} style={{ position: "absolute", width: bottle.w, left: bottle.left, top: bottle.bottom - bottle.h }} />
    </>
  );
};

// A soft highlight that travels down the glass, clipped to the bottle's silhouette
const Sweep: React.FC<{ id: "A" | "B"; at: number; dur: number }> = ({ id, at, dur }) => {
  const f = useCurrentFrame();
  const p = (f - at) / dur;
  if (p < -0.2 || p > 1.2) return null;
  const { bottle } = FRAMES[id];
  const mask = `url(${staticFile("cut/bottle.png")})`;
  return (
    <div
      style={{
        position: "absolute",
        width: bottle.w,
        height: bottle.h,
        left: bottle.left,
        top: bottle.bottom - bottle.h,
        WebkitMaskImage: mask,
        WebkitMaskSize: "100% 100%",
        maskImage: mask,
        maskSize: "100% 100%",
        background: `linear-gradient(160deg, rgba(255,255,255,0) ${p * 150 - 50}%, rgba(255,236,200,0.5) ${p * 150 - 32}%, rgba(255,255,255,0) ${p * 150 - 14}%)`,
        mixBlendMode: "screen",
      }}
    />
  );
};

const Shot: React.FC<{ id: "A" | "B"; overlay: boolean; push: [number, number]; origin: string; sweepAt: number; volume: number }> = ({
  id,
  overlay,
  push,
  origin,
  sweepAt,
  volume,
}) => {
  const f = useCurrentFrame();
  const dur = id === "A" ? REEL11.cut : REEL11.total - REEL11.cut;
  const scale = interpolate(f, [0, dur], push, { easing: Easing.inOut(Easing.sin) });
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: origin }}>
        <OffthreadVideo src={staticFile(`clips/${id}.mp4`)} volume={volume} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {overlay ? <RealProduct id={id} /> : null}
        <Sweep id={id} at={sweepAt} dur={36} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Reel11: React.FC<Props> = ({ overlayA, overlayB, clipVolume }) => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(f, [REEL11.total - 8, REEL11.total], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
        <Sequence durationInFrames={REEL11.cut}>
          <Shot id="A" overlay={overlayA} push={[1, 1.06]} origin="50% 52%" sweepAt={84} volume={clipVolume} />
        </Sequence>
        <Sequence from={REEL11.cut}>
          <Shot id="B" overlay={overlayB} push={[1.04, 1.1]} origin="45% 50%" sweepAt={96} volume={clipVolume} />
        </Sequence>
      </AbsoluteFill>
      <Audio src={staticFile("audio/music11.mp3")} volume={0.85} />
    </AbsoluteFill>
  );
};
