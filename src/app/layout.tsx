import type { Metadata } from 'next';
import './globals.css';
import Header from '@/app/header/header';
import React from 'react';
import Footer from '@/app/footer/footer';

export const metadata: Metadata = {
  title: '지하실(JIHASIL)',
  description: '영화와 사람이 만나는 공간',
  openGraph: {
    description: '영화와 사람이 만나는 공간',
    images: 'main.png',
    url: 'https://www.jihasil.com/',
    type: 'website',
  },
  keywords: ['영화', '지하실', '매거진', '예술', 'film', 'magazine', 'art'],
  icons: {
    icon: 'ji.svg',
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body suppressHydrationWarning={true}>
      <Header />
      <div className="pt-16 pb-8 px-8 my-5">
        {children}
      </div>
      <Footer />
    </body>
    </html>
  );
}
