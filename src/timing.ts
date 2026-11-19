// One bar of the 96 BPM score = 2.5s. Shot starts are in frames; the music's big hits land on
// 2.5s (drop impact) and 22.5s (spray).
export const FPS = 30;
export const BAR = 75;
export const s = (sec: number) => Math.round(sec * FPS);

export const SHOTS = {
  drop: { from: 0, dur: s(2.5) },
  cardamom: { from: s(2.5), dur: s(2.5) },
  chestnut: { from: s(5), dur: s(1.25) },
  sugar: { from: s(6.25), dur: s(1.25) },
  sage: { from: s(7.5), dur: s(2.5) },
  lavender: { from: s(10), dur: s(2.5) },
  reveal: { from: s(12.5), dur: s(2.5) },
  vanilla: { from: s(15), dur: s(2.5) },
  wood: { from: s(17.5), dur: s(2.5) },
  smoke: { from: s(20), dur: s(2.5) },
  spray: { from: s(22.5), dur: s(2.5) },
  hero: { from: s(25), dur: s(5) },
} as const;

export const TOTAL = s(30);

// Overlap used for dissolves between shots
export const XF = 8;
