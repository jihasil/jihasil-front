"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/app/(front)/components/ui/button";
import { DeleteDialog } from "@/app/(front)/components/ui/delete-dialog";
import { fetchR } from "@/app/(front)/shared/lib/request";

export const EditPostTrigger = (props: { postId: string }) => {
  const { postId } = props;
  const router = useRouter();

  const onDelete = async () => {
    const response = await fetchR(`/api/post/${postId}`, {
      method: "DELETE",
    });
    console.log(response);
    const body = await response.json();
    toast.info(body.message);
    router.push("/");
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Link
        href={{
          pathname: `/post/edit/${postId}`,
        }}
        className="col-span-1"
      >
        <Button className="w-full">수정</Button>
      </Link>
      <DeleteDialog deleteMethod={onDelete} className="col-span-1" />
    </div>
  );
};
