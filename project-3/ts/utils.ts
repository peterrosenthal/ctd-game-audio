import { SoundFontPlayer, INoteSequence } from '@magenta/music/es6';
import Settings from './components/Settings';

/**
 * Inspiration taken from this stack overflow post: https://stackoverflow.com/a/49434653
 * @param min The minimum possible value that could be returned
 * @param max The maximum possible value that could be returned
 * @param skew As skew -> 0, expected value -> max. As skew -> infinity, expected value -> min
 * @returns A random number between max and min, skewed by the skew factor
 */
export function getSkewedRandom(min: number, max: number, skew: number): number {
  let u = 0;
  let v = 0;
  while (u === 0) {
    u = Math.random();
  }
  while (v === 0) {
    v = Math.random();
  }
  let num = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  num = num / 10 + 0.5;
  if (num > 1 || num < 0) {
    num = getSkewedRandom(min, max, skew);
  } else {
    num = Math.pow(num, skew);
    num *= max - min;
    num += min;
  }
  return num;
}

/**
 * Asyncronous delay in JavaScript
 * @param ms milleseconds to delay for
 * @returns promise with type settimeout function... meant to be used for a delay
 */
export function delay(ms: number): Promise<Function> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Kind of like the modulo operator, "wraps" a number around a maximum.
 * But unlike the modulo operator, it behaves like a triangle wave instead of a sawtooth wave.
 */
export function rampUpDownMod(value: number, max: number): number {
  return max - Math.abs(value % (max * 2) - max);
}
