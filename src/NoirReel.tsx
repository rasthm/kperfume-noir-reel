import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, XF, s } from "./timing";
import { CardamomShot, ChestnutShot, DropShot, SugarShot } from "./shots/Top";
import { LavenderShot, RevealShot, SageShot } from "./shots/Heart";
import { HeroShot, SmokeShot, SprayShot, VanillaShot, WoodShot } from "./shots/Base";
import { Grain, Vignette } from "./fx/Finish";

// Dissolve in over `fade` frames (0 = hard cut on the beat)
const FadeIn: React.FC<{ fade: number; children: React.ReactNode }> = ({ fade, children }) => {
  const f = useCurrentFrame();
  const opacity = fade ? interpolate(f, [0, fade], [0, 1], { extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

type ShotId = keyof typeof SHOTS;
const ORDER: { id: ShotId; fade: number; el: React.ReactNode }[] = [
  { id: "drop", fade: 0, el: <DropShot impact={SHOTS.drop.dur - 3} /> },
  { id: "cardamom", fade: 12, el: <CardamomShot /> },
  { id: "chestnut", fade: 0, el: <ChestnutShot /> },
  { id: "sugar", fade: 0, el: <SugarShot /> },
  { id: "sage", fade: XF + 4, el: <SageShot /> },
  { id: "lavender", fade: XF + 4, el: <LavenderShot /> },
  { id: "reveal", fade: XF + 6, el: <RevealShot /> },
  { id: "vanilla", fade: XF + 6, el: <VanillaShot /> },
  { id: "wood", fade: XF + 6, el: <WoodShot /> },
  { id: "smoke", fade: XF + 6, el: <SmokeShot /> },
  { id: "spray", fade: 0, el: <SprayShot /> },
  { id: "hero", fade: XF + 4, el: <HeroShot /> },
];

// [file, start (s), volume] — starts put each effect's peak on its visual moment
const SFX: [string, number, number][] = [
  ["drop", 2.4, 0.8],
  ["crackle", 2.75, 0.6],
  ["crack", 4.55, 0.5],
  ["sparkle", 6.25, 0.7],
  ["breeze", 7.5, 0.35],
  ["chime", 13.1, 0.6],
  ["ember", 17.5, 0.6],
  ["swell", 18.9, 0.45],
  ["whoosh", 21.75, 0.55],
  ["spray", 22.57, 0.9],
  ["boom", 24.8, 0.6],
];

export const NoirReel: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {ORDER.map(({ id, fade, el }, i) => {
      const { from, dur } = SHOTS[id];
      // each shot runs on into the next one's dissolve
      const next = ORDER[i + 1];
      const tail = next ? next.fade : 0;
      return (
        <Sequence key={id} name={id} from={from} durationInFrames={dur + tail}>
          <FadeIn fade={fade}>{el}</FadeIn>
        </Sequence>
      );
    })}
    <Vignette strength={0.55} />
    <Grain opacity={0.08} />

    <Audio src={staticFile("audio/music.mp3")} volume={0.9} />
    {SFX.map(([name, at, volume]) => (
      <Sequence key={name} name={`sfx-${name}`} from={s(at)}>
        <Audio src={staticFile(`audio/${name}.mp3`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
