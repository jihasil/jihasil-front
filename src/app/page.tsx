"use client";

import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import React from "react";

import { LastPostKey, PostMetadata } from "@/app/utils/post";
import { Navigation } from "@/components/ui/navigation";
import { PostThumbnail } from "@/components/ui/post-thumbnail";
import ShowNonApproved from "@/components/ui/show-non-approved";
import { Skeleton } from "@/components/ui/skeleton";
import { issueDisplay } from "@/const/issue";
import { useInfiniteObjectList } from "@/hooks/use-infinite-object-list";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { CheckedState } from "@radix-ui/react-checkbox";

function Images(props: {
  postMetadataList: PostMetadata[];
  showNonApproved: CheckedState;
}) {
  const smSize = window.matchMedia("(min-width: 640px)");
  const thumbnailSize = smSize.matches ? 700 : 500;
  console.log(thumbnailSize);

  return props.postMetadataList
    .filter((item) => props.showNonApproved || (item.is_approved ?? true))
    .map((item, index) => (
      <div key={index} className="w-full h-fit">
        <Link href={`/post/view/${item.post_id ?? item.post_id}`}>
          <PostThumbnail
            postMetadata={item}
            imageSize={thumbnailSize}
            isClickable={true}
          />
        </Link>
      </div>
    ));
}

function SkeletonImages() {
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
}

export default function Home() {
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

  const [issueFilter, setIssueFilter] = useSessionStorage<string>(
    "issueFilter",
    "all",
  );

  const [showNonApproved, setShowNonApproved] = useSessionStorage<CheckedState>(
    "showNonApproved",
    false,
  );

  const changeIssue = (issueFilter: string) => {
    initiate();
    setIssueFilter(issueFilter);
  };

  const modifySearchParams = (searchParams: URLSearchParams) => {
    if (issueFilter !== "all") {
      searchParams.append("issueId", issueFilter);
    }
  };

  const { objectList, isInitiated, initiate } = useInfiniteObjectList<
    PostMetadata,
    LastPostKey
  >("/api/post", "postMetadataList", modifySearchParams, getPageSize);

  return (
    <div className="col-span-full grid grid-cols-subgrid my-gap">
      <div className="col-span-full grid grid-cols-subgrid my-grid my-gap">
        <div className="col-span-2">
          <Navigation
            selects={issueDisplay}
            onValueChange={changeIssue}
            default={issueFilter}
          />
        </div>
        <div className="lg:col-span-1 md:col-span-1 col-span-2">
          <SessionProvider>
            <ShowNonApproved
              onCheckedChange={setShowNonApproved}
              checked={showNonApproved}
            />
          </SessionProvider>
        </div>
      </div>
      <div className="overflow-y-auto col-span-full overflow-x-hidden">
        <div className="grid my-gap w-full sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          {!isInitiated.current ? (
            <SkeletonImages />
          ) : (
            <Images
              postMetadataList={objectList}
              showNonApproved={showNonApproved}
            />
          )}
        </div>
      </div>
    </div>
  );
}
