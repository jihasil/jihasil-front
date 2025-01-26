import { ImageLoader } from "@/components/ui/image-loader";

export default async function PageViewer({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const uuid = (await params).uuid;

  return (
    <div className="grid lg:grid-cols-12 md:grid-cols-8 sm:grid-cols-4 gap-3">
      <div className="w-full flex flex-col h-2/3 col-span-3 bg-red-700">
        <ImageLoader src={""} alt={"thumbnail"} />
        <p>왕빙에 대한 소고</p>
        <p>그의 영화를 열렬히 지지하게 된 경위</p>
        <div className="flex">
          <p>칼럼</p>
          <p>|</p>
          <p>도현</p>
        </div>
      </div>
      <div className="w-full h-2/3 col-span-9 bg-blue-500">어쩌고 저쩌고</div>
    </div>
  );
}
