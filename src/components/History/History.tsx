import styles from './History.module.css';

export function History({ numbers }: { numbers: readonly number[] }) {
  const recentNumbers = numbers.slice(-15).reverse();
  return (
    <section className={styles.history} aria-label="Number history">
      <div className={styles.heading}><span>Recent calls</span><span className={styles.total}>{numbers.length}/90</span></div>
      {recentNumbers.length === 0 ? <p className={styles.empty}>Numbers will appear here.</p> : <ol className={styles.list}>{recentNumbers.map((number, index) => <li key={`${number}-${index}`} className={index === 0 ? styles.latest : undefined}>{number}</li>)}</ol>}
    </section>
  );
}
