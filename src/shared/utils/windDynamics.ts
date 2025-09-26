import { rand } from './rand';
import { vw } from './viewWidth';

// -----------------------------------------------------
// Wind / noise helpers (time in seconds)
// -----------------------------------------------------
const now = () => performance.now() / 1000; // seconds
// mid/slow wiggle
const n1 = (t: number, f = 0.07) => Math.sin(t * 2 * Math.PI * f);
// slightly faster wiggle
const n2 = (t: number, f = 0.11) => Math.sin((t + 13.37) * 2 * Math.PI * f);
// slower background sway
const n3 = (t: number, f = 0.041) => Math.sin((t + 7.5) * 2 * Math.PI * f);

// -----------------------------
// Dynamic gust envelope
// -----------------------------
type GustConfig = {
  freqHz?: number; // how often gusts occur (default 0.02Hz → ~50s period)
  phase?: number; // horizontal offset of the sine wave (default 0)
  power?: number; // exponent to sharpen gust peaks (default 2 = square)
  floor?: number; // minimum baseline intensity (default 0)
};

// defaults = your current behavior
const DEFAULT_GUST_CONFIG: Required<GustConfig> = {
  freqHz: 0.02,
  phase: 0,
  power: 2,
  floor: 0,
};

/**
 * gust(t, config?)
 * - Produces a smooth envelope [0..1] that rises and falls like wind gusts.
 * - By default: sin wave (0.02Hz) squared → long quiet stretches + sharp gust peaks.
 */
const gust = (t: number, cfg?: GustConfig): number => {
  const c = { ...DEFAULT_GUST_CONFIG, ...(cfg ?? {}) };

  // raw sine: oscillates [-1, +1]
  const sine = Math.sin(t * 2 * Math.PI * c.freqHz + c.phase);

  // clamp negatives → gusts only when sine is above baseline
  const g = Math.max(0, sine);

  // shape the peaks: higher `power` makes gusts shorter + punchier
  const shaped = Math.pow(g, c.power);

  // add a baseline floor (so it never fully shuts off)
  return c.floor + (1 - c.floor) * shaped;
};
type WindXConfig = {
  // amplitude scaling
  viewportScale?: boolean; // if true, scale by vw(); otherwise use 1
  baseAmpFactor?: number; // multiplies vw() for the steady term (default 0.06)
  wobbleFactor?: number; // multiplies vw() for the wobble term (default 0.03)
  gustScaleFactor?: number; // multiplies vw() for the gust term (default 0.08)

  // steady term shaping
  steadyFreqHz?: number; // frequency for steady baseline (default 0.03)
  steadyClipMul?: number; // tanh(steadyClipMul * sin(...)) soft-clips (default 4)

  // wobble mix weights (should roughly sum to ~1, but doesn’t have to)
  wobbleWeights?: { n1: number; n2: number; n3: number };

  // gust envelope (use a custom fn or the built-in)
  gustFn?: (t: number) => number; // returns [0..1]; default is gust(t)
};

// default config reproducing your current behavior
const DEFAULT_WINDX_CONFIG: Required<WindXConfig> = {
  viewportScale: true,
  baseAmpFactor: 0.06,
  wobbleFactor: 0.03,
  gustScaleFactor: 0.08,

  steadyFreqHz: 0.03,
  steadyClipMul: 4,

  wobbleWeights: { n1: 0.6, n2: 0.3, n3: 0.1 },

  gustFn: gust,
};

/**
 * windX(t, config?)
 * - Returns horizontal wind velocity (px/sec).
 * - Pass a partial config to override any piece; omit for defaults.
 */
const windX = (t: number, cfg?: WindXConfig) => {
  const c = { ...DEFAULT_WINDX_CONFIG, ...(cfg ?? {}) };

  const vwScale = c.viewportScale ? vw() : 1;

  // Steady baseline: slow sine, soft-clipped so it has a “max wind” feel.
  const steady = Math.tanh(c.steadyClipMul * n1(t, c.steadyFreqHz)) * (vwScale * c.baseAmpFactor);

  // Mid/high-frequency wobble: small constant jitter.
  const wobbleMix =
    n1(t) * c.wobbleWeights.n1 + n2(t) * c.wobbleWeights.n2 + n3(t) * c.wobbleWeights.n3;

  const wobble = wobbleMix * (vwScale * c.wobbleFactor);

  // Gust: envelope (0..1) scaled to pixels/sec.
  const gustAmp = c.gustFn(t) * (vwScale * c.gustScaleFactor);

  return steady + wobble + gustAmp;
};

// -----------------------------
// Dynamic vertical wind (windY)
// -----------------------------
type WindYConfig = {
  // oscillator frequencies (Hz → cycles per second)
  freq1?: number; // default 0.09 Hz
  freq2?: number; // default 0.05 Hz

  // oscillator weights (how much each contributes)
  weight1?: number; // default 0.5
  weight2?: number; // default 0.5

  // overall scaling factor in px/sec
  amplitude?: number; // default 22
};

// Defaults = your original function
const DEFAULT_WINDY_CONFIG: Required<WindYConfig> = {
  freq1: 0.09,
  freq2: 0.05,
  weight1: 0.5,
  weight2: 0.5,
  amplitude: 22,
};

/**
 * windY(t, config?)
 * - Produces vertical wind velocity (px/sec).
 * - By default: two low-frequency oscillators blended equally, scaled to ±22.
 */
function windY(t: number, cfg?: WindYConfig): number {
  const c = { ...DEFAULT_WINDY_CONFIG, ...(cfg ?? {}) };

  // Two sine oscillators with different frequencies
  const osc1 = n1(t, c.freq1); // [-1, 1]
  const osc2 = n2(t, c.freq2); // [-1, 1]

  // Weighted blend
  const blended = osc1 * c.weight1 + osc2 * c.weight2;

  // Scale into px/sec
  return blended * c.amplitude;
}

// -----------------------------
// Windspin
// -----------------------------
type WindSpinConfig = {
  // oscillator frequencies (Hz)
  freq1?: number; // default 0.06 Hz
  freq2?: number; // default 0.04 Hz

  // oscillator blend weights
  weight1?: number; // default 0.7
  weight2?: number; // default 0.3

  // maximum spin amplitude in deg/sec
  amplitude?: number; // default 90

  // gust envelope settings
  gustFreq?: number; // default 0.02 Hz
  floor?: number; // minimum envelope value (never drops below this, default 0.35)
  ceiling?: number; // maximum envelope multiplier (default 1.0)
};

/** Defaults = your original function */
const DEFAULT_WINDSPIN_CONFIG: Required<WindSpinConfig> = {
  freq1: 0.06,
  freq2: 0.04,
  weight1: 0.7,
  weight2: 0.3,
  amplitude: 90,
  gustFreq: 0.02,
  floor: 0.35,
  ceiling: 1.0,
};

/**
 * windSpin(t, config?)
 * - Produces rotational spin velocity in degrees/sec.
 * - By default: two sine oscillators blended, modulated by a gust envelope
 *   that ranges between 0.35x and 1x strength.
 */

const windSpin = (t: number, cfg?: WindSpinConfig): number => {
  const c = { ...DEFAULT_WINDSPIN_CONFIG, ...(cfg ?? {}) };

  // --- base oscillators (two blended sine waves)
  const osc1 = n1(t, c.freq1); // [-1,1]
  const osc2 = n2(t, c.freq2); // [-1,1]
  const swirlDegPerSec = (osc1 * c.weight1 + osc2 * c.weight2) * c.amplitude;

  // --- gust envelope (0..1 shaped, squared sine wave)
  const rawGust = Math.max(0, Math.sin(t * 2 * Math.PI * c.gustFreq));
  const shaped = rawGust * rawGust;

  // map gusts into [floor..ceiling] range
  const envelope = c.floor + (c.ceiling - c.floor) * shaped;

  // --- final spin = base oscillation * gust modulation
  return swirlDegPerSec * envelope;
};

// -----------------------------
// Dynamic Spin Envelope Generator
// -----------------------------
type SpinEnvelopeConfig = {
  burstHz?: number; // burst frequency (how often bursts occur) [default random 0.02–0.05 Hz]
  phase?: number; // phase offset of the sine wave [default random 0..2π]
  sharpness?: number; // higher = shorter, punchier bursts [default random 3–6]
};

/**
 * makeSpinEnvelope(config?)
 * - Returns a function f(t) → [0..1] that modulates spin in bursts.
 * - By default: randomized frequency, phase, and sharpness.
 */
const makeSpinEnvelope = (cfg?: SpinEnvelopeConfig) => {
  const burstHz = cfg?.burstHz ?? rand(0.02, 0.05); // cycles per second
  const phase = cfg?.phase ?? rand(0, Math.PI * 2); // offset the wave
  const sharpness = cfg?.sharpness ?? rand(3, 6); // controls burst punchiness

  // Returned function: evaluates envelope at time `t`
  return (t: number): number => {
    // base sine: oscillates between -1 and +1
    const sine = Math.sin(2 * Math.PI * burstHz * t + phase);

    // map to [0..1] → 0.5 + 0.5*sin
    const normalized = 0.5 + 0.5 * sine;

    // apply sharpness → compress valleys, sharpen peaks
    return Math.pow(normalized, sharpness);
  };
};

export default { now, windSpin, makeSpinEnvelope, windY, windX };
