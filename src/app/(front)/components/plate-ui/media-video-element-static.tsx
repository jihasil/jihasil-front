import React from "react";

import type { SlateElementProps } from "@udecode/plate";
import type { TCaptionElement } from "@udecode/plate-caption";
import type { TVideoElement } from "@udecode/plate-media";

import { cn } from "@udecode/cn";
import { NodeApi, SlateElement } from "@udecode/plate";
import { cfUrl } from "@/app/(back)/shared/lib/s3";

export function MediaVideoElementStatic({
  children,
  className,
  ...props
}: SlateElementProps) {
  const {
    align = "center",
    caption,
    url,
    width,
  } = props.element as TVideoElement &
    TCaptionElement & {
      width: number;
    };

  let youtubeEmbedUrl: string | null = null;

  // https://regex101.com/r/rq2KLv/1
  // youtube 에러 v id 추출하는 정규식
  const youtubeRegexMatch = url.match(
    "(?:https?:\\/\\/)?(?:www\\.)?youtu(?:\\.be\\/|be.com\\/\\S*(?:watch|embed)(?:(?:(?=\\/[-a-zA-Z0-9_]{11,}(?!\\S))\\/)|(?:\\S*v=|v\\/)))([-a-zA-Z0-9_]{11,})",
  );

  if (youtubeRegexMatch && youtubeRegexMatch.length > 1) {
    const vId = youtubeRegexMatch[1];
    youtubeEmbedUrl = `https://youtube.com/embed/${vId}`;
  }

  console.log("youtubeRegexMatch", youtubeRegexMatch, url);
  console.log("youtubeEmbedUrl", youtubeEmbedUrl);

  return (
    <SlateElement className={cn(className, "py-2.5")} {...props}>
      <div style={{ textAlign: align }}>
        {cfUrl && url.startsWith(cfUrl) ? (
          <figure
            className="group relative m-0 inline-block cursor-default"
            style={{ width }}
          >
            <video
              className={cn(
                "w-full max-w-full object-cover px-0",
                "rounded-sm",
              )}
              src={url}
              controls
            />
          </figure>
        ) : (
          <div className="relative w-full pb-[56.25%]">
            <iframe
              className={cn("absolute w-full h-full")}
              src={youtubeEmbedUrl ?? url}
            />
          </div>
        )}
        {caption && <figcaption>{NodeApi.string(caption[0])}</figcaption>}
      </div>
      {children}
    </SlateElement>
  );
}
