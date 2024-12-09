import styles from "./page.module.css";
import Display from '@/app/display/masonry'

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Display />
      </main>
    </div>
  );
}
