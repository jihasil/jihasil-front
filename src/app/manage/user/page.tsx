"use client";

import React from "react";

import { User } from "@/app/utils/user";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteObjectList } from "@/hooks/use-infinite-object-list";

function UserSkeleton() {
  return [...Array(15)].map((e, index) => (
    <div
      key={index}
      className="col-span-full grid grid-cols-subgrid my-gap lg:h-12 md:h-10 h-8"
    >
      <Skeleton className="col-span-1 w-full " />
      <Skeleton className="col-span-1 w-full " />
      <Skeleton className="-col-end-1 col-span-1 " />
    </div>
  ));
}

function UserElement(props: { users: User[] }) {
  return props.users.map((user, index) => {
    return (
      <div
        key={index}
        className="col-span-full grid grid-cols-subgrid items-center my-gap"
      >
        <p className="col-span-1 text-center">{user.id}</p>
        <p className="col-span-1 text-center">{user.name}</p>
        <Button className="-col-end-1 col-span-1">초기화</Button>
        <Separator className="col-span-full" />
      </div>
    );
  });
}

export default function ManageUserPage() {
  const { isInitiated, objectList } = useInfiniteObjectList<User, string>(
    "/api/user",
    "users",
  );

  return (
    <div className="grid grid-cols-subgrid md:col-span-8 col-span-4 lg:col-start-3 my-gap">
      <div className="col-span-full grid grid-cols-subgrid items-center my-gap text-center font-bold">
        <p className="col-span-1">ID</p>
        <p className="col-span-1">이름</p>
        <p className="-col-end-1">동작</p>
        <Separator className="col-span-full" />
      </div>
      <div className="col-span-full grid grid-cols-subgrid my-gap">
        {!isInitiated.current ? (
          <UserSkeleton />
        ) : (
          <UserElement users={objectList} />
        )}
      </div>
    </div>
  );
}
