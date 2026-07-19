import { memo, useMemo } from 'react';
import clsx from 'clsx';
import styles from './Board.module.css';

interface BoardProps {
  calledNumbers: readonly number[];
  currentNumber: number | null;
}

function BoardComponent({ calledNumbers, currentNumber }: BoardProps) {
  const calledNumbersSet = useMemo(() => new Set(calledNumbers), [calledNumbers]);

  return (
    <section className={styles.boardPanel} aria-label="Tambola board">
      <div className={styles.grid}>
        {Array.from({ length: 90 }, (_, index) => {
          const number = index + 1;
          const isCalled = calledNumbersSet.has(number);
          const isCurrent = currentNumber === number;
          return (
            <div
              key={number}
              className={clsx(styles.cell, isCalled && styles.called, isCurrent && styles.current)}
              aria-label={`${number}${isCurrent ? ', current number' : isCalled ? ', called' : ', not called'}`}
            >
              {number}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export const Board = memo(BoardComponent);
