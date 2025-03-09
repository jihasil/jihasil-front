"use client";

import Image, { ImageProps } from "next/image";
import React from "react";
import { cn } from "@/app/(front)/shared/lib/utils";
import { ButtonProps } from "@/app/(front)/components/ui/button";

export const ImageLoader = React.forwardRef<HTMLButtonElement, ImageProps>(
  ({ src, alt, className }, ref) => {
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
  },
);
