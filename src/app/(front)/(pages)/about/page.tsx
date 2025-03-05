import "./about.css";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

import { Button } from "@/app/(front)/components/ui/button";
import { ImageLoader } from "@/app/(front)/components/ui/image-loader";

export const metadata: Metadata = {
  title: "지하실(JIHASIL)이란",
  openGraph: {
    title: "지하실(JIHASIL)이란",
    description: "지하실에 대한 설명과 구매처",
    url: "https://www.jihasil.com/about/",
  },
};

export default function Home() {
  return (
    <div className="col-span-full flex flex-col my-gap">
      <div>
        <p className="text-2xl font-bold">지하실(JIHASIL)이란?</p>
        <p>
          <strong>「지하실(JIHASIL)」</strong>
          <a
            href="https://www.instagram.com/jihasil_co/"
            className="w-fit h-fit"
            target={"_blank"}
            rel="noreferrer"
          >
            <ImageLoader
              className="w-fit h-4 justify-center inline-flex me-2"
              alt={"instagram_logo"}
              src="https://static.cdnlogo.com/logos/i/92/instagram.svg"
            />
          </a>
          은 테마에 맞는 영화를 선정해서 각 작품에 대해 심도높은 토의를 하기
          의한 매거진이자 모임 포맷입니다. <br />
          분기마다 출간되며, 오픈형 모임도 진행합니다. <br />
          매거진 구매는 네이버 스토어와 아래 독립서점에서 진행 가능합니다.
        </p>
      </div>

      <div>
        <p className="text-2xl font-bold">구매처</p>
        <p>
          <a
            className="naver-link"
            href="https://smartstore.naver.com/jihasil"
            target="_blank"
            rel="noreferrer"
          >
            네이버 스토어
          </a>
        </p>
        <p>
          스토리지북앤필름(
          <a
            className="insta-link"
            target="_blank"
            href="https://www.instagram.com/storagebookandfilm/"
            rel="noreferrer"
          >
            @storagebookandfilm
          </a>
          ) <br />
          가가77페이지(
          <a
            className="insta-link"
            target="_blank"
            href="https://www.instagram.com/gaga77page/"
            rel="noreferrer"
          >
            @gaga77page
          </a>
          ) <br />
          종이잡지클럽(
          <a
            className="insta-link"
            target="_blank"
            href="https://www.instagram.com/the_magazine_club/"
            rel="noreferrer"
          >
            @the_magazine_club
          </a>
          ) <br />
          프루스트의 서재(
          <a
            className="insta-link"
            target="_blank"
            href="https://www.instagram.com/library_of_proust/"
            rel="noreferrer"
          >
            @library_of_proust
          </a>
          ) <br />
          올오어낫싱(
          <a
            className="insta-link"
            target="_blank"
            href="https://www.instagram.com/allornothing_deardark/"
            rel="noreferrer"
          >
            @allornothing_deardark
          </a>
          ) <br />
        </p>

        <p></p>
      </div>

      <Button className="w-fit">
        <Link href="/subscribe">구독하기</Link>
      </Button>
    </div>
  );
}
