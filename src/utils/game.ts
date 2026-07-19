const UINT32_RANGE = 4_294_967_296;

/**
 * Returns a uniform integer in [0, maxExclusive). Rejection sampling avoids
 * modulo bias when the random source's range is not divisible by the target.
 */
function getUniformRandomIndex(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive < 1) {
    throw new RangeError('maxExclusive must be a positive integer.');
  }

  const upperBound = Math.floor(UINT32_RANGE / maxExclusive) * maxExclusive;
  const randomValue = new Uint32Array(1);

  do {
    globalThis.crypto.getRandomValues(randomValue);
  } while (randomValue[0] >= upperBound);

  return randomValue[0] % maxExclusive;
}

/**
 * Produces one unbiased Fisher–Yates ordering without mutating source values.
 * Every number has the same chance of occupying each available position.
 */
export function fisherYatesShuffle(values: readonly number[]): number[] {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = getUniformRandomIndex(index + 1);
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

export function createGameId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `game-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const tambolaNumbers = Array.from({ length: 90 }, (_, index) => index + 1);

export function getNumberCall(number: number): string {
  const digits = number.toString().split('').map(Number);
  const digitWords = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

  return digits.map((digit) => digitWords[digit]).join(' ');
}
