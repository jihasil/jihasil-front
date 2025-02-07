"use client";

import React from "react";

import { User } from "@/app/utils/user";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteObjectList } from "@/hooks/use-infinite-object-list";

function UserSkeleton() {
  return [...Array(15)].map((e, index) => (
    <div key={index} className="w-fit h-fit flex my-gap ">
      <Skeleton className="w-10" />
      <Skeleton className="w-5" />
      <Skeleton className="w-5" />
    </div>
  ));
}

function UserElement(props: { users: User[] }) {
  return props.users.map((user, index) => {
    return (
      <div className="flex flex-col w-fit my-gap my-m" key={index}>
        <div className="flex w-fit my-gap items-center">
          <p>{user.name}</p>
          <Button>비밀번호 초기화</Button>
        </div>
        <Separator className="w-full" />
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
    <div>
      {!isInitiated.current ? (
        <UserSkeleton />
      ) : (
        <UserElement users={objectList} />
      )}
    </div>
  );
}
