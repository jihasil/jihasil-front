"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/app/(front)/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/(front)/components/ui/dialog";
import SubmitButton from "@/app/(front)/components/ui/submit-button";
import { fetchR } from "@/app/(front)/shared/lib/request";

export const EditPostTrigger = (props: { postId: string }) => {
  const { postId } = props;
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  return (
    <>
      <Link
        href={{
          pathname: `/post/edit/${postId}`,
        }}
      >
        <Button className="w-full">수정</Button>
      </Link>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">삭제</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>삭제하시겠습니까?</DialogTitle>
            <DialogDescription className="my-3">
              되돌릴 수 없습니다. 정말로 지우시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-3">
              <DialogClose asChild>
                <Button>아니요</Button>
              </DialogClose>
              <SubmitButton
                variant="destructive"
                onClick={() => {
                  setIsUploading(true);
                  console.log(postId);
                  fetchR(`/api/post/${postId}`, {
                    method: "DELETE",
                  })
                    .then(async (response) => {
                      const body = await response.json();
                      toast.info(body.message);
                      router.push("/");
                    })
                    .finally(() => {
                      setIsUploading(false);
                    });
                }}
                text="삭제"
                isUploading={isUploading}
              />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
