"use client";

import Image from "next/image";
import React from "react";
import { cn } from "@/shared/lib/utils";

export const ImageLoader = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt?: string | undefined;
  className?: string | undefined;
}) => {
  return (
    <Image
      data-loaded="false"
      width={1000}
      height={1000}
      src={src}
      alt={alt ?? "image"}
      onLoad={(event) => {
        event.currentTarget.setAttribute("data-loaded", "true");
      }}
      className={cn(
        "object-cover data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/10 aspect-square",
        className,
      )}
      loading="lazy"
    />
  );
};
