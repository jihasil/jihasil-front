"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/app/(front)/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/(front)/components/ui/dropdown-menu";
import { Navigation } from "@/app/(front)/components/ui/navigation";
import { Separator } from "@/app/(front)/components/ui/separator";
import { Skeleton } from "@/app/(front)/components/ui/skeleton";
import { useInfiniteObjectList } from "@/app/(front)/shared/hooks/use-infinite-object-list";
import { fetchR } from "@/app/(front)/shared/lib/request";
import { RoleUnion, roleSelection } from "@/app/global/enum/roles";
import {
  UserEditRequestDTO,
  UserEntry,
  UserKey,
} from "@/app/global/types/user-types";

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
  users: UserEntry[];
  changeUserData: (user: UserEditRequestDTO) => Promise<boolean>;
  changeUserPassword: (user: UserEditRequestDTO) => Promise<void>;
  deleteUser: (index: number, user: UserEditRequestDTO) => Promise<boolean>;
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
            onValueChange={(value: RoleUnion) => {
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
                  props.deleteUser(index, user);
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
  const router = useRouter();

  const { isInitiated, objectList, setObjectList } = useInfiniteObjectList<
    UserEntry,
    UserKey
  >("/api/user/all", "users", undefined, () => {
    return 15;
  });

  const changeUserData = async (user: UserEditRequestDTO) => {
    const response = await fetchR("/api/user", {
      method: "PATCH",
      body: JSON.stringify(user),
    });

    const body = await response.json();

    if (response.ok) {
      toast.info(body.message);
      return true;
    } else {
      toast.error(body.message);
      return false;
    }
  };

  const changeUserPassword = async (user: UserEditRequestDTO) => {
    router.push(
      `/user/edit/?userId=${user.id}&from=${encodeURIComponent("/manage/user")}`,
    );
  };

  const deleteUser = async (index: number, user: UserEditRequestDTO) => {
    const response = await fetchR("/api/user", {
      method: "DELETE",
      body: JSON.stringify({ id: user.id }),
    });
    const body = await response.json();

    if (response.ok) {
      toast.info(body.message);
      setObjectList([
        ...objectList.slice(0, index),
        ...objectList.slice(index + 1),
      ]);

      return true;
    } else {
      toast.error(body.message);
      return false;
    }
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
      <div className="col-span-full my-m"></div>
      <Button asChild>
        <Link href="/signUp">사용자 추가</Link>
      </Button>
    </div>
  );
}
