import { ImageLoader } from "@/app/(front)/components/ui/image-loader";
import { Separator } from "@/app/(front)/components/ui/separator";
import { categoryValue } from "@/app/global/enum/category";
import { issueBackgroundColor, issueTextColor } from "@/app/global/enum/issue";
import { PostEntry } from "@/app/global/types/post-types";
import { cn } from "@udecode/cn";

const PostThumbnail = (props: {
  postEntry: PostEntry;
  imageSize?: number;
  isClickable?: boolean;
}) => {
  const { postEntry, imageSize, isClickable } = props;

  let thumbnailUrl = postEntry.thumbnailUrl;

  if (imageSize) {
    thumbnailUrl += `?width=${imageSize}`;
  }

  return (
    <div
      className={cn(
        "w-full flex flex-col my-gap",
        issueTextColor[postEntry.issueId],
      )}
    >
      <ImageLoader
        src={thumbnailUrl ?? "main.png"}
        alt={"thumbnail"}
        className={cn(
          "w-full h-auto",
          `${isClickable ? "transform transition duration-500 hover:brightness-50" : null}`,
        )}
      />
      <div>
        <p className="font-bold text-xl text-opacity-100">{postEntry.title}</p>
        <p className="text-sm text-opacity-70 whitespace-nowrap text-ellipsis overflow-hidden">
          {postEntry.subtitle}
        </p>
      </div>
      <div className="flex gap-1 items-center text-sm text-opacity-70">
        <p className="me-2">●</p>
        <p className="font-bold">{categoryValue[postEntry.category]}</p>
        <p>|</p>
        <p>{postEntry?.author}</p>
      </div>
      <Separator
        className={issueBackgroundColor[postEntry.issueId ?? "none"]}
      />
    </div>
  );
};

export { PostThumbnail };
