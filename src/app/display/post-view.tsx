import { Post } from "@/app/api/post/route";
import { ImageLoader } from "@/components/ui/image-loader";

export default function PostView(props: { post: Post }) {
  const { post } = props;

  return (
    <div>
      <ImageLoader
        src={post.imageUrl}
        alt={post.title ?? "jihasil post"}
        className="w-full h-auto"
      />
    </div>
  );
}
