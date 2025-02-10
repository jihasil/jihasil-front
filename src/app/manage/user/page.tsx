"use client";

import React from "react";

import { User } from "@/app/utils/user";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteObjectList } from "@/hooks/use-infinite-object-list";

function UserSkeleton() {
  return [...Array(15)].map((e, index) => (
    <div key={index} className="subgrid my-gap-x lg:h-24 md:h-18 h-16">
      <div className="subgrid my-my items-center">
        <Skeleton className="col-span-1 w-full h-full" />
        <Skeleton className="col-span-1 w-full h-full" />
        <Skeleton className="md:col-span-2 col-span-1 w-full h-full" />
        <Skeleton className="-col-end-1 col-span-1 h-full" />
      </div>
    </div>
  ));
}

function UserElement(props: { users: User[] }) {
  return props.users.map((user, index) => {
    return (
      <div key={index} className="subgrid items-center my-gap-x text-center">
        <div className="subgrid my-my items-center">
          <p className="col-span-1 text-center">{user.id}</p>
          <p className="col-span-1 text-center">{user.name}</p>
          <p className="md:col-span-2 col-span-1">{user.role}</p>
          <Button className="-col-end-1 col-span-1">초기화</Button>
        </div>
        <Separator className="col-span-full" />
      </div>
    );
  });
}

export default function ManageUserPage() {
  const { isInitiated, objectList } = useInfiniteObjectList<User, string>(
    "/api/user",
    "users",
    undefined,
    () => {
      return 15;
    },
  );

  return (
    <div className="grid grid-cols-subgrid md:col-span-8 col-span-4 lg:col-start-3 my-gap-x overflow-hidden rounded-md">
      <div className="bg-foreground subgrid items-center my-gap-x text-center font-bold">
        <div className="subgrid my-my text-background">
          <p className="col-span-1">ID</p>
          <p className="col-span-1">이름</p>
          <p className="md:col-span-2 col-span-1">역할</p>
          <p className="-col-end-1">동작</p>
        </div>
        <Separator className="col-span-full" />
      </div>
      <div className="subgrid my-gap-x max-h-[70vh] overflow-y-scroll scrollbar-hide">
        {!isInitiated.current ? (
          <UserSkeleton />
        ) : (
          <UserElement users={objectList} />
        )}
      </div>
    </div>
  );
}
