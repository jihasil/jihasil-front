import type { Metadata } from "next";
import "./globals.css";
import React from "react";

import Footer from "@/widgets/footer";
import Header from "@/widgets/header";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jihasil.com"),
  title: "지하실(JIHASIL)",
  description: "영화와 사람이 만나는 공간",
  openGraph: {
    description: "영화와 사람이 만나는 공간",
    images: "main.png",
    url: "https://www.jihasil.com/",
    type: "website",
  },
  keywords: ["영화", "지하실", "매거진", "예술", "film", "magazine", "art"],
  icons: {
    icon: "ji.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body
        className="w-full flex justify-center"
        suppressHydrationWarning={true}
      >
        <SpeedInsights />
        <div className="my-mx w-full my-grid min-h-screen grid-rows-[auto_1fr_auto] my-gap-x xl:max-w-7xl">
          <Header />
          <main className="col-span-full grid grid-cols-subgrid h-fit">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
