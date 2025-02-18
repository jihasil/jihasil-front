import { Checkbox } from "@/components/plate-ui/checkbox";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckedState } from "@radix-ui/react-checkbox";
import { cn } from "@/shared/lib/utils";

export default function ShowNonApproved(props: {
  onCheckedChange: any;
  checked: CheckedState;
  className?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "w-full h-full flex items-center gap-2",
              props.className,
            )}
          >
            <Checkbox
              checked={props.checked}
              onCheckedChange={props.onCheckedChange}
            />
            <p>전체</p>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>숨긴 글을 모두 표시합니다. (관리자 기능)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
