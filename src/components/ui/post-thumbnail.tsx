import { ImageLoader } from "@/components/ui/image-loader";
import { Metadata } from "@/app/utils/post";
import { CategoryValue, printCategoryName } from "@/const/category";
import { Separator } from "@/components/ui/separator";

const PostThumbnail = (props: { metadata: Metadata }) => {
  return (
    <div className="flex flex-col my-gap">
      {/*// TODO: ui component 로 작성*/}
      <ImageLoader
        src={
          props?.metadata.thumbnail_url ??
          props?.metadata.imageUrl ??
          props?.metadata.thumbnail
        }
        alt={"thumbnail"}
        className="w-full h-auto"
      />
      <div>
        <p className="font-bold text-xl">
          {props?.metadata?.title ?? "테스트 제목"}
        </p>
        <p className="text-sm">
          {props?.metadata?.subtitle ?? "테스트 부제목에 관한 고찰"}
        </p>
      </div>
      <div className="flex gap-1 items-center text-sm">
        <p>●</p>
        <p className="font-bold">
          {CategoryValue[props?.metadata?.category ?? "magazine"]}
        </p>
        <p>|</p>
        <p>{props?.metadata?.author ?? "준"}</p>
      </div>
      <Separator />
    </div>
  );
};

export { PostThumbnail };
