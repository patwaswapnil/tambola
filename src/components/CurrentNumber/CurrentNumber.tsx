import styles from './CurrentNumber.module.css';
import { getNumberCall } from '../../utils/game';
import { RollingNumber } from '../RollingNumber/RollingNumber';

interface CurrentNumberProps {
  number: number | null;
  previousNumber: number | null;
  isSpinning: boolean;
}

export function CurrentNumber({ number, previousNumber, isSpinning }: CurrentNumberProps) {
  return (
    <section className={styles.card} aria-label="Current number" aria-live="polite" aria-atomic="true">
      <RollingNumber number={number} previousNumber={previousNumber} animate={isSpinning} />
      <p className={styles.call}>{number === null ? 'Ready for the first call' : isSpinning ? 'Spinning the reels…' : getNumberCall(number)}</p>
    </section>
  );
}
