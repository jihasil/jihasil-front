import { ImageLoader } from "@/components/ui/image-loader";
import { Metadata } from "@/app/utils/post";
import { CategoryValue } from "@/const/category";
import { Separator } from "@/components/ui/separator";
import { issueBackgroundColor, issueTextColor } from "@/const/issue";

const PostThumbnail = (props: { metadata: Metadata; size?: number }) => {
  let divClassName = "w-full flex flex-col my-gap ";
  const textColor = issueTextColor[props.metadata.issue_id ?? "none"];
  divClassName += textColor;

  let thumbnailUrl =
    props?.metadata.thumbnail_url ??
    props?.metadata.imageUrl ??
    props?.metadata.thumbnail ??
    "https://d5ws8pqr5saw9.cloudfront.net/jihasil-stage/post-media/main.png"; // default image

  if (props.size) {
    thumbnailUrl += `?width=${props.size}`;
  }

  return (
    <div className={divClassName}>
      <ImageLoader
        src={thumbnailUrl}
        alt={"thumbnail"}
        className="w-full h-auto"
      />
      <div>
        <p className="font-bold text-xl text-opacity-100">
          {props?.metadata?.title ?? "테스트 제목"}
        </p>
        <p className="text-sm text-opacity-70">
          {props?.metadata?.subtitle ?? "테스트 부제목에 관한 고찰"}
        </p>
      </div>
      <div className="flex gap-1 items-center text-sm text-opacity-70">
        <p className="me-2">●</p>
        <p className="font-bold">
          {CategoryValue[props?.metadata?.category ?? "magazine"]}
        </p>
        <p>|</p>
        <p>{props?.metadata?.author ?? "준"}</p>
      </div>
      <Separator
        className={issueBackgroundColor[props.metadata.issue_id ?? "none"]}
      />
    </div>
  );
};

export { PostThumbnail };
