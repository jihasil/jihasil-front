import type { Metadata } from "next";
import "./globals.css";
import { NavigationGuardProvider } from "next-navigation-guard";
import React from "react";

import Footer from "@/app/footer/footer";
import Header from "@/app/header/header";
import PreventRoute from "@/app/prevent-route";

export const metadata: Metadata = {
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
        className="bg-background lg:mx-6 md:mx-5 mx-4"
        suppressHydrationWarning={true}
      >
        <div className="w-full min-h-[100vh] flex flex-col xl:max-w-7xl mx-auto">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
