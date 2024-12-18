import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/app/header/header';
import React from 'react';
import Footer from '@/app/footer/footer';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: '지하실(JIHASIL)',
  description: '영화와 사람이 만나는 공간',
  openGraph: {
    description: '영화와 사람이 만나는 공간',
    images: 'main.png',
    url: 'https://www.jihasil.com/',
    type: 'website'
  },
  keywords: ['영화', '지하실', '매거진', '예술', 'film', 'magazine', 'art'],
  icons: {
    icon: "ji.svg"
  }
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning={true}>
    <Header />
    <main
      style={{
        flex: 1,  // 남은 공간을 채우도록 설정
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',  // 콘텐츠를 수직 중앙에 배치
        alignItems: 'center',  // 콘텐츠를 수평 중앙에 배치
        marginTop: '64px',
        padding: 0,
        margin: 0,
      }}
    >
      {children}
    </main>
    <Footer />
    </body>
    </html>
  );
}
