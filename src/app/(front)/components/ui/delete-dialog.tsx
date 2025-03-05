"use client";

import { useState } from "react";

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
import { cn } from "@/app/(front)/shared/lib/utils";

export const DeleteDialog = (props: {
  deleteMethod: () => Promise<any>;
  className?: string;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { deleteMethod, className } = props;

  return (
    <Dialog>
      <DialogTrigger className={cn(className)} asChild>
        <Button variant="destructive">삭제</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>삭제하시겠습니까?</DialogTitle>
          <DialogDescription className="my-3">
            이 작업은 되돌릴 수 없습니다. 정말로 삭제하시겠습니까?
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
                console.log("asdf");
                deleteMethod().finally(() => {
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
  );
};
