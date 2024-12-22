import React from 'react';
import Link from 'next/link';

export default function footerFunction() {
  return (
    <footer className="flex justify-center items-center">
      <Link href="/subscribe">구독하기
      </Link>
    </footer>
  );
}