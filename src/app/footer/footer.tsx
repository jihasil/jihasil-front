import React from 'react';
import Link from 'next/link';
import styles from './footer.module.css';

export default function footerFunction() {
  return (
    <footer>
      <Link className={styles.subscribeButton}
            href="/subscribe">구독하기
      </Link>
      <strong>
        Copyright 2024. Jihasil All rights reserved
      </strong>
    </footer>
  );
}