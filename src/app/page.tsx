"use client";

import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";

import { LastPostKey, Metadata, PostResponseDTO } from "@/app/utils/post";
import { Navigation } from "@/components/ui/navigation";
import { PostThumbnail } from "@/components/ui/post-thumbnail";
import ShowNonApproved from "@/components/ui/show-non-approved";
import { Skeleton } from "@/components/ui/skeleton";
import { issueDisplay } from "@/const/issue";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { CheckedState } from "@radix-ui/react-checkbox";

function Images(props: {
  metadata: Metadata[];
  showNonApproved: CheckedState;
}) {
  const smSize = window.matchMedia("(min-width: 640px)");
  const thumbnailSize = smSize.matches ? 700 : 500;
  console.log(thumbnailSize);

  const dom = props.metadata
    .filter((item) => props.showNonApproved || (item.is_approved ?? true))
    .map((item, index) => (
      <div
        key={index}
        className="w-full h-fit transform transition duration-500 hover:scale-90"
      >
        <Link href={`/post/view/${item.post_uuid ?? item.uuid}`}>
          <PostThumbnail metadata={item} size={thumbnailSize} />
        </Link>
      </div>
    ));
  return dom;
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

  const [lastPostKey, setLastPostKey] = useState<LastPostKey | null>(null);
  const [metadata, setMetadata] = useState<Metadata[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [issueFilter, setIssueFilter] = useSessionStorage<string>(
    "issueFilter",
    "all",
  );
  const [initiating, setInitiating] = useState<boolean>(true);
  const [showNonApproved, setShowNonApproved] = useSessionStorage<CheckedState>(
    "showNonApproved",
    false,
  );

  const initiate = () => {
    setMetadata([]);
    setLastPostKey(null);
    setHasMore(true);
    setIsLoading(false);
  };

  const changeIssue = (issueFilter: string) => {
    initiate();
    setIssueFilter(issueFilter);
  };

  const fetchMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    console.debug("Fetching more");
    console.debug(hasMore);

    let url = "/api/post/";
    const searchParams = new URLSearchParams();

    const pageSize = getPageSize();

    if (lastPostKey) {
      const lastPostKeyJson = JSON.stringify(lastPostKey);
      searchParams.append("lastPostKey", lastPostKeyJson);
    }

    if (issueFilter !== "all") {
      searchParams.append("issueId", issueFilter);
    }

    searchParams.append("pageSize", pageSize.toString());

    url += `?${searchParams.toString()}`;
    console.log(url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    try {
      if (response.ok) {
        const { posts, isLast, LastEvaluatedKey }: PostResponseDTO =
          await response.json();
        setHasMore(!isLast);
        setMetadata((prevState) => [...prevState, ...posts]);
        console.info(LastEvaluatedKey);
        setLastPostKey(LastEvaluatedKey);
      } else {
        setHasMore(false);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, issueFilter, lastPostKey]);

  const handleScroll = useCallback(async () => {
    const scrollTop = window.scrollY; // Pixels scrolled from the top
    const windowHeight = window.innerHeight; // Visible area height
    const documentHeight = document.documentElement.scrollHeight; // Total page height

    // Check if scrolled beyond 70%
    if (scrollTop / (documentHeight - windowHeight) >= 0.7) {
      await fetchMore();
    }
  }, [fetchMore]);

  useEffect(() => {
    setInitiating(true);

    fetchMore().finally(() => {
      setInitiating(false);
    });
  }, [issueFilter, fetchMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [metadata, hasMore, isLoading, handleScroll]);

  return (
    <div className="flex flex-1 flex-col my-gap w-full items-center">
      <div className="w-full grid my-gap lg:grid-cols-12 md:grid-cols-8 grid-cols-6">
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
      <div className="overflow-y-auto w-full overflow-x-hidden">
        <div className="grid my-gap w-full sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          {initiating ? (
            <SkeletonImages />
          ) : (
            <Images metadata={metadata} showNonApproved={showNonApproved} />
          )}
        </div>
      </div>
    </div>
  );
}
