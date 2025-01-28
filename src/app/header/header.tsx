import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";

const userSection = async () => {
  const session = await auth();
  const name = session?.user?.name;

  if (name) {
    // 로그인 돼있는 경우
    return (
      <div className="flex items-center">
        <button className="lg:px-6 md:px-5 px-4 bg-transparent hover:bg-white hover:text-black text-white transition-all duration-300 ease-in-out">
          <Link href="/myPage">MYPAGE</Link>
        </button>
        <button className="lg:px-6 md:px-5 px-4 bg-transparent hover:bg-white hover:text-black text-white transition-all duration-300 ease-in-out">
          <Link href="/post/edit">WRITE</Link>
        </button>
      </div>
    );
  } else {
    return null;
  }
};

const TransparentHeader = () => {
  return (
    <header className="bg-background sticky top-0 z-[2147483647] lg:py-6 md:py-5 py-4">
      <div className="grid lg:grid-cols-12 md:grid-cols-8 grid-cols-4 lg:gap-6 md:gap-5 gap-4">
        <div className="w-full lg:col-span-2 md:col-span-2 col-span-1">
          <button className="h-full w-full">
            <Link href="/">
              <Image
                width={1000}
                height={1000}
                className="w-full h-auto"
                src="/jihasil_logo.svg"
                alt="Logo"
              />
            </Link>
          </button>
        </div>
        <div className="col-span-2 -col-end-1 flex w-full justify-end">
          {userSection()}
          <button className="lg:px-6 md:px-5 px-4 bg-transparent hover:bg-white hover:text-black text-white transition-all duration-300 ease-in-out">
            <Link href="/about">ABOUT</Link>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TransparentHeader;
