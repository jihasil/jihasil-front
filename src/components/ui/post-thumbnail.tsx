import { ImageLoader } from "@/components/ui/image-loader";
import { PostMetadata } from "@/app/utils/post";
import { CategoryValue } from "@/const/category";
import { Separator } from "@/components/ui/separator";
import { issueBackgroundColor, issueTextColor } from "@/const/issue";
import { cn } from "@udecode/cn";

const PostThumbnail = (props: {
  postMetadata: PostMetadata;
  imageSize?: number;
  isClickable?: boolean;
}) => {
  let divClassName = "w-full flex flex-col my-gap ";
  const textColor = issueTextColor[props.postMetadata.issue_id ?? "none"];
  divClassName += textColor;

  let thumbnailUrl =
    props?.postMetadata.thumbnail_url ??
    "https://d5ws8pqr5saw9.cloudfront.net/jihasil-stage/post-media/main.png"; // default image

  if (props.imageSize) {
    thumbnailUrl += `?width=${props.imageSize}`;
  }

  return (
    <div className={divClassName}>
      <ImageLoader
        src={thumbnailUrl}
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
        <p className="text-sm text-opacity-70">
          {props?.postMetadata?.subtitle}
        </p>
      </div>
      <div className="flex gap-1 items-center text-sm text-opacity-70">
        <p className="me-2">●</p>
        <p className="font-bold">
          {CategoryValue[props?.postMetadata?.category]}
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
