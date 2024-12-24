"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dispatch, SetStateAction } from 'react';

export default function Navigation(props: {setIssueFilter: Dispatch<SetStateAction<string>> }) {
  const { setIssueFilter } = props;
  const [position, setPosition] = React.useState("all")

  return (
    <nav>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-inherit hover:bg-white hover:text-black" variant="outline">이슈</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-black">
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="all" onClick={() => setIssueFilter('')}>전체 보기</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="issue_001" onClick={() => setIssueFilter('issue_001')}>프레임 속의 프레임</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="issue_002" onClick={() => setIssueFilter('issue_002')}>돌아오기 위한 여정</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}