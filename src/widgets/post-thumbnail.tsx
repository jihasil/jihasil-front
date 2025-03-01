import { ImageLoader } from "@/components/ui/image-loader";
import { Separator } from "@/components/ui/separator";
import { categoryValue } from "@/shared/enum/category";
import { issueBackgroundColor, issueTextColor } from "@/shared/enum/issue";
import { PostMetadata } from "@/shared/types/post-types";
import { cn } from "@udecode/cn";

const PostThumbnail = (props: {
  postMetadata: PostMetadata;
  imageSize?: number;
  isClickable?: boolean;
}) => {
  let thumbnailUrl = props?.postMetadata.thumbnail_url;

  if (props.imageSize) {
    thumbnailUrl += `?width=${props.imageSize}`;
  }

  return (
    <div
      className={cn(
        "w-full flex flex-col my-gap",
        issueTextColor[props.postMetadata.issue_id],
      )}
    >
      <ImageLoader
        src={thumbnailUrl ?? "main.png"}
        alt={"thumbnail"}
        className={cn(
          "w-full h-auto",
          `${props.isClickable ? "transform transition duration-500 hover:brightness-50" : null}`,
        )}
      />
      <div>
        <p className="font-bold text-xl text-opacity-100">
          {props?.postMetadata?.title}
        </p>
        <p className="text-sm text-opacity-70 whitespace-nowrap text-ellipsis overflow-hidden">
          {props?.postMetadata?.subtitle}
        </p>
      </div>
      <div className="flex gap-1 items-center text-sm text-opacity-70">
        <p className="me-2">●</p>
        <p className="font-bold">
          {categoryValue[props?.postMetadata?.category]}
        </p>
        <p>|</p>
        <p>{props?.postMetadata?.author}</p>
      </div>
      <Separator
        className={issueBackgroundColor[props.postMetadata.issue_id ?? "none"]}
      />
    </div>
  );
};

export { PostThumbnail };
