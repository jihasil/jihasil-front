import { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    title: "지하실 웹 매거진 구독",
    description: "지하실 웹 매거진을 구독해보세요",
    url: "https://www.jihasil.com/subscribe/",
  },
};

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <h3>곧 시작합니다!</h3>
    </div>
  );
}
