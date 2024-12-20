import React from 'react';
import Link from 'next/link';

export default function footerFunction() {
  return (
    <footer className="text-sm h-8 fixed bottom-0 flex justify-center items-center">
      <Link className="" href="/subscribe">구독하기
      </Link>
    </footer>
  );
}