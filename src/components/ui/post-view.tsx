import { ImageLoader } from "@/components/ui/image-loader";
import { Metadata } from "@/app/utils/post";

export default function PostView(props: { post: Metadata }) {
  const { post } = props;

  return (
    <div>
      <ImageLoader
        src={post.imageUrl ?? post.thumbnail}
        alt={post.title ?? "jihasil post"}
        className="w-full h-auto"
      />
    </div>
  );
}
