"use client";

import Link from "next/link";
import React from "react";

import { Navigation } from "@/app/(front)/components/ui/navigation";
import ShowNonApproved from "@/app/(front)/components/ui/show-non-approved";
import { Skeleton } from "@/app/(front)/components/ui/skeleton";
import { useInfiniteObjectList } from "@/app/(front)/shared/hooks/use-infinite-object-list";
import { useSessionStorage } from "@/app/(front)/shared/hooks/use-session-storage";
import { PostThumbnail } from "@/app/(front)/widgets/post-thumbnail";
import { IssueUnion, issueSelection } from "@/app/global/enum/issue";
import { ClientSession } from "@/app/global/types/auth-types";
import { PostEntry, PostKey } from "@/app/global/types/post-types";
import { CheckedState } from "@radix-ui/react-checkbox";

export const PostGrid = (props: { id?: string; session?: ClientSession }) => {
  const getPageSize = () => {
    const smSize = window.matchMedia("(min-width: 640px)");
    const lgSize = window.matchMedia("(min-width: 1024px)");

    if (smSize === undefined || lgSize === undefined) return 10;

    let pageSize: number;
    const isSmallScreen = smSize.matches; // sm 기준
    const isLargeScreen = lgSize.matches; // lg 기준
    if (isLargeScreen) {
      pageSize = 30;
    } else if (isSmallScreen) {
      pageSize = 20;
    } else {
      pageSize = 10;
    }
    return pageSize;
  };

  const [issueFilter, setIssueFilter] = useSessionStorage<IssueUnion | "all">(
    "issueFilter",
    "all",
  );

  const [showNonApproved, setShowNonApproved] = useSessionStorage<boolean>(
    "showNonApproved",
    false,
  );

  const changeIssue = (issueFilter: IssueUnion | "all") => {
    initiate();
    setIssueFilter(issueFilter);
  };

  const modifySearchParams = (searchParams: URLSearchParams) => {
    if (issueFilter !== "all") {
      searchParams.append("issueId", issueFilter);
    }
  };

  const { objectList, isInitiated, initiate } = useInfiniteObjectList<
    PostEntry,
    PostKey
  >(
    "/api/post" + (props.id ? `?id=${props.id}` : ""),
    "postMetadataList",
    modifySearchParams,
    getPageSize,
  );

  const postEntryList = objectList.filter(
    (item) => showNonApproved || (item.isApproved ?? true),
  );

  return (
    <div className="col-span-full grid grid-cols-subgrid my-gap">
      <div className="col-span-full grid grid-cols-subgrid my-grid my-gap">
        <Navigation
          selects={[{ value: "all", display: "모든 이슈" }, ...issueSelection]}
          onValueChange={changeIssue}
          default={issueFilter}
          className="col-span-2"
        />
        {props.session ? (
          <ShowNonApproved
            className="md:col-span-1 col-span-2"
            onCheckedChange={setShowNonApproved}
            checked={showNonApproved}
          />
        ) : null}
      </div>
      <div className="overflow-y-auto col-span-full">
        {isInitiated.current && postEntryList.length === 0 ? (
          <div className="w-full flex items-center justify-center">
            <p>게시글이 없습니다.</p>
          </div>
        ) : null}

        <div className="grid my-gap w-full sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          {!isInitiated.current ? (
            <SkeletonImages />
          ) : (
            <Images postEntryList={postEntryList} />
          )}
        </div>
      </div>
    </div>
  );
};

const Images = (props: { postEntryList: PostEntry[] }) => {
  const smSize = window.matchMedia("(min-width: 640px)");
  const thumbnailSize = smSize.matches ? 700 : 500;
  console.log(thumbnailSize);

  return props.postEntryList.map((item, index) => (
    <div key={index} className="w-full h-fit">
      <Link href={`/post/view/${item.postId}`}>
        <PostThumbnail
          postEntry={item}
          imageSize={thumbnailSize}
          isClickable={true}
        />
      </Link>
    </div>
  ));
};

const SkeletonImages = () => {
  return [...Array(15)].map((e, index) => (
    <div key={index} className="w-full h-fit flex flex-col my-gap ">
      <Skeleton className="w-full h-auto aspect-square" />
      <div className="flex flex-col gap-1">
        <Skeleton className="w-[75%] lg:h-6 md:h-5 h-4" />
        <Skeleton className="w-[50%] lg:h-6 md:h-5 h-4" />
      </div>
      <Skeleton className="w-[25%] lg:h-6 md:h-5 h-4" />
    </div>
  ));
};
