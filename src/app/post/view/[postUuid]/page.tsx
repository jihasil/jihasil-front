import Link from "next/link";

import { getPost } from "@/app/utils/post";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { ImageLoader } from "@/components/ui/image-loader";

export default async function PageViewer({
  params,
}: {
  params: Promise<{ postUuid: string }>;
}) {
  const postUuid = (await params).postUuid;
  const session = await auth();

  // TODO: uuid 로 글 받아오기
  const post = await getPost(postUuid);
  console.log(postUuid);
  console.log(post);

  return (
    <div className="grid lg:grid-cols-12 md:grid-cols-8 grid-cols-4 gap-3 w-full">
      {session?.user ? (
        <div className="col-span-1 lg:col-start-12 md:col-start-8 col-start-4">
          <Link
            href={{
              pathname: "/post/edit",
              query: {
                postUuid: postUuid,
              },
            }}
          >
            <Button className="w-full">수정</Button>
          </Link>
        </div>
      ) : null}
      <div className="h-2/3 lg:col-span-3 md:col-span-2 col-span-4">
        <div className="flex flex-col">
          {/*// TODO: ui component 로 작성*/}
          <ImageLoader
            src={post?.metadata?.thumbnail_url}
            alt={"thumbnail"}
            className="w-full h-auto"
          />
          <p>{post?.metadata?.title}</p>
          <p>{post?.metadata?.subtitle}</p>
          <div className="flex">
            <p>{post?.metadata?.category}</p>
            <p>|</p>
            <p>{post?.metadata?.author}</p>
          </div>
        </div>
      </div>
      {/*// TODO: html 삽입*/}
      <div className="w-full h-2/3 lg:col-span-9 md:col-span-6 col-span-4 bg-blue-500">
        {post?.html}
      </div>
    </div>
  );
}
