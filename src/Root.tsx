import { Composition, Still } from "remotion";
import { NoirReel } from "./NoirReel";
import { StartFrame } from "./StartFrame";
import { REEL11, Reel11 } from "./Reel11";
import { FPS, TOTAL } from "./timing";

export const Root: React.FC = () => (
  <>
    <Composition id="NoirReel" component={NoirReel} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition
      id="Noir11"
      component={Reel11}
      durationInFrames={REEL11.total}
      fps={REEL11.fps}
      width={1080}
      height={1920}
      defaultProps={{ overlayA: false, overlayB: false, clipVolume: 0.6 }}
    />
    <Still id="StartA" component={StartFrame} defaultProps={{ id: "A" as const }} width={1080} height={1920} />
    <Still id="StartB" component={StartFrame} defaultProps={{ id: "B" as const }} width={1080} height={1920} />
  </>
);
