import { NextRequest, NextResponse } from "next/server";

import { userService } from "@/app/(back)/application/model/user-service";

export const GET = async (nextRequest: NextRequest) => {
  const pageSize = Number(
    nextRequest.nextUrl.searchParams.get("pageSize") ?? 10,
  );

  const lastKeyJson = nextRequest.nextUrl.searchParams.get("lastKey");
  const lastKey = lastKeyJson ? JSON.parse(lastKeyJson) : null;

  const userEntryList = await userService.getUserEntryList({
    pageSize,
    lastKey,
  });

  if (userEntryList) {
    return new NextResponse(JSON.stringify(userEntryList), {
      status: 200,
    });
  } else {
    return new NextResponse(
      JSON.stringify({ message: "사용자를 가져올 수 없습니다." }),
      {
        status: 500,
      },
    );
  }
};
