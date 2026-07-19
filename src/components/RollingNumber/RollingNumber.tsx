import { useLayoutEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { MACHINE_SPIN_DURATION_SECONDS } from '../../features/machine/machineConfig';
import styles from './RollingNumber.module.css';

type ReelDirection = 'up' | 'down';

interface RollingNumberProps {
  number: number | null;
  previousNumber: number | null;
  animate: boolean;
}

interface ReelProps {
  digits: readonly number[];
  direction: ReelDirection;
}

const MINIMUM_SPIN_CYCLES = 2;

function modulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function getDigit(value: number, place: 'tens' | 'ones'): number {
  return place === 'tens' ? Math.floor(value / 10) : value % 10;
}

function createReelDigits(start: number, target: number, direction: ReelDirection): number[] {
  const delta = direction === 'up' ? modulo(target - start, 10) : modulo(start - target, 10);
  const steps = MINIMUM_SPIN_CYCLES * 10 + delta;
  const stepDirection = direction === 'up' ? 1 : -1;
  const forwardDigits = Array.from({ length: steps + 1 }, (_, index) =>
    modulo(start + index * stepDirection, 10)
  );

  return direction === 'up' ? forwardDigits : forwardDigits.reverse();
}

function Reel({ digits, direction }: ReelProps) {
  const viewportRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const steps = digits.length - 1;

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (track === null) return;

    const reelHeight = viewportRef.current?.getBoundingClientRect().height ?? 0;
    if (reelHeight === 0) return;

    const initialPosition = direction === 'up' ? 0 : -steps * reelHeight;
    const finalPosition = direction === 'up' ? -steps * reelHeight : 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const context = gsap.context(() => {
      gsap.set(track, { y: initialPosition });
      if (reduceMotion) {
        gsap.set(track, { y: finalPosition });
        return;
      }
      gsap.to(track, {
        y: finalPosition,
        duration: MACHINE_SPIN_DURATION_SECONDS,
        ease: 'sine.out',
        force3D: true
      });
    }, viewportRef);

    return () => context.revert();
  }, [digits, direction, steps]);

  return (
    <span
      ref={viewportRef}
      className={clsx(styles.reel, direction === 'up' ? styles.up : styles.down)}
      aria-hidden="true"
    >
      <span ref={trackRef} className={styles.track}>
        {digits.map((digit, index) => (
          <span className={styles.digit} key={`${digit}-${index}`}>
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
}

function StaticReel({ digit }: { digit: number }) {
  return (
    <span className={styles.reel} aria-hidden="true">
      <span className={styles.track}>
        <span className={styles.digit}>{digit}</span>
      </span>
    </span>
  );
}

export function RollingNumber({ number, previousNumber, animate }: RollingNumberProps) {
  const reelDigits = useMemo(() => {
    if (number === null) return null;

    const previous = previousNumber ?? 0;
    return {
      tens: createReelDigits(getDigit(previous, 'tens'), getDigit(number, 'tens'), 'up'),
      ones: createReelDigits(getDigit(previous, 'ones'), getDigit(number, 'ones'), 'down')
    };
  }, [number, previousNumber]);

  if (number === null || reelDigits === null) return <span className={styles.placeholder}>—</span>;
  const targetNumber = number;
  if (!animate) {
    return (
      <span className={styles.rollingNumber} aria-label={`Number ${targetNumber}`}>
        <StaticReel digit={getDigit(targetNumber, 'tens')} />
        <StaticReel digit={getDigit(targetNumber, 'ones')} />
      </span>
    );
  }

  return (
    <span className={styles.rollingNumber} aria-label="Spinning number reels">
      <Reel digits={reelDigits.tens} direction="up" />
      <Reel digits={reelDigits.ones} direction="down" />
    </span>
  );
}
