import Image from "next/image";
import Link from "next/link";
import React from "react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

const userSection = async () => {
  const session = await auth();
  const name = session?.user?.name;

  if (name) {
    // 로그인 돼있는 경우
    return (
      <div className="flex justify-center items-center gap-5">
        <p>안녕하세요, {name} 님!</p>
        <Button>글쓰기</Button>
      </div>
    );
  } else {
    return null;
  }
};

const TransparentHeader = () => {
  return (
    <header className="bg-background flex sticky top-0 z-10">
      <div className="flex w-full justify-between h-full p-5 px-8">
        <div className="flex items-center gap-5">
          <button>
            <Link href="/">
              <Image
                width={1000}
                height={1000}
                className="h-5 w-auto"
                src="/jihasil_logo.svg"
                alt="Logo"
              />
            </Link>
          </button>
        </div>

        <div className="flex items-center gap-5">
          {userSection()}
          <button>
            <Link href="/about">ABOUT</Link>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TransparentHeader;
