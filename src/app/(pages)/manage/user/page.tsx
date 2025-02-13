"use client";

import React from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Navigation } from "@/components/ui/navigation";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { roleSelection } from "@/shared/const/roles";
import { useInfiniteObjectList } from "@/shared/hooks/use-infinite-object-list";
import { User } from "@/shared/types/user-types";

function UserSkeleton() {
  return [...Array(15)].map((e, index) => (
    <div key={index} className="subgrid my-gap-x lg:h-24 md:h-18 h-16">
      <div className="subgrid my-my items-center">
        <Skeleton className="col-span-1 w-full h-full" />
        <Skeleton className="col-span-1 w-full h-full" />
        <Skeleton className="col-span-1 w-full h-full" />
        <Skeleton className="-col-end-1 col-span-1 h-full" />
      </div>
    </div>
  ));
}

function UserElement(props: {
  users: User[];
  changeUserData: (user: User) => Promise<void>;
  changeUserPassword: (user: User) => Promise<void>;
  deleteUser: (user: User) => Promise<void>;
}) {
  return props.users.map((user, index) => {
    return (
      <div key={index} className="subgrid items-center my-gap-x text-center">
        <div className="subgrid my-my items-center">
          <p className="col-span-1 text-center">{user.id}</p>
          <p className="col-span-1 text-center">{user.name}</p>
          {/*<p className="md:col-span-2 col-span-1">{user.role}</p>*/}
          <Navigation
            className="col-span-1"
            selects={roleSelection}
            default={user.role}
            onValueChange={(value: string) => {
              user.role = value;
              props.changeUserData(user);
            }}
          />
          {/*<Button className="-col-end-1 col-span-1">초기화</Button>*/}
          <DropdownMenu>
            <DropdownMenuTrigger className="-col-end-1 col-span-1 rounded-full">
              &#xFE19;
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user.id}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  props.changeUserPassword(user);
                }}
              >
                비밀번호 초기화
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  props.deleteUser(user);
                }}
              >
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

  const changeUserData = async (user: User) => {
    const response = await fetch("/api/user", {
      method: "PUT",
      body: JSON.stringify(user),
    });
    if (response.ok) {
      toast.info(`${user.id}의 정보를 수정했습니다.`);
    } else {
      toast.error(`${user.id}의 정보를 수정하는데 실패했습니다.`);
    }
  };

  const changeUserPassword = async (user: User) => {
    toast.info(`${user.id}의 비밀번호를 수정했습니다.`);
  };

  const deleteUser = async (user: User) => {
    toast.info(`${user.id}를 삭제했습니다.`);
  };

  return (
    <div className="grid grid-cols-subgrid md:col-span-8 col-span-4 lg:col-start-3 my-gap-x overflow-hidden rounded-md">
      <div className="bg-foreground subgrid items-center my-gap-x text-center font-bold">
        <div className="subgrid my-my text-background">
          <p className="col-span-1">ID</p>
          <p className="col-span-1">이름</p>
          <p className="col-span-1">역할</p>
          <p className="-col-end-1">동작</p>
        </div>
        <Separator className="col-span-full" />
      </div>
      <div className="subgrid my-gap-x max-h-[70vh] overflow-y-scroll scrollbar-hide">
        {!isInitiated.current ? (
          <UserSkeleton />
        ) : (
          <UserElement
            users={objectList}
            changeUserData={changeUserData}
            changeUserPassword={changeUserPassword}
            deleteUser={deleteUser}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
}
