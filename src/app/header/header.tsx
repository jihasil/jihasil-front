import Image from "next/image";
import Link from "next/link";
import React from "react";

const TransparentHeader = () => {
  return (
    <header className="bg-background flex sticky top-0 z-10">
      <div className="flex w-full justify-between h-full p-5 px-8">
        <div className="flex items-center">
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

        <div className="flex items-center">
          <button>
            <Link href="/about">ABOUT</Link>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TransparentHeader;
