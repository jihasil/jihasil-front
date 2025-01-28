"use client";

import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";

import { LastPostKey, Metadata, PostResponseDTO } from "@/app/utils/post";
import { Navigation } from "@/components/ui/navigation";
import { PostThumbnail } from "@/components/ui/post-thumbnail";
import { Progress } from "@/components/ui/progress";
import ShowNonApproved from "@/components/ui/show-non-approved";
import { issueDisplay } from "@/const/issue";
import { CheckedState } from "@radix-ui/react-checkbox";

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
  const [issueFilter, setIssueFilter] = useState("all");
  const [initiating, setInitiating] = useState<boolean>(true);
  const [progress, setProgress] = useState(0);
  const [showNonApproved, setShowNonApproved] = useState<CheckedState>(false);

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

  const fetchMore = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    console.debug("Fetching more");
    console.debug(hasMore);
    setProgress(13);

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
    setProgress(33);

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    try {
      if (response.ok) {
        setProgress(80);
        const { posts, isLast, LastEvaluatedKey }: PostResponseDTO =
          await response.json();
        setHasMore(!isLast);
        setProgress(100);
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
  };

  const galleryRef = useRef<HTMLDivElement>(null);

  const handleScroll = async () => {
    const scrollTop = window.scrollY; // Pixels scrolled from the top
    const windowHeight = window.innerHeight; // Visible area height
    const documentHeight = document.documentElement.scrollHeight; // Total page height

    // Check if scrolled beyond 70%
    if (scrollTop / (documentHeight - windowHeight) >= 0.7) {
      await fetchMore();
    }
  };

  useEffect(() => {
    setInitiating(true);

    fetchMore().finally(() => {
      setInitiating(false);
    });
  }, [issueFilter]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [metadata, hasMore, isLoading]);

  return (
    <div className="flex flex-1 flex-col my-gap w-full items-center">
      <div className="w-full grid my-gap lg:grid-cols-12 md:grid-cols-8 grid-cols-6">
        <div className="col-span-2">
          <Navigation selects={issueDisplay} onValueChange={changeIssue} />
        </div>
        <div className="lg:col-span-1 md:col-span-1 col-span-2">
          <SessionProvider>
            <ShowNonApproved onCheckedChange={setShowNonApproved} />
          </SessionProvider>
        </div>
      </div>
      <div ref={galleryRef} className="overflow-y-auto">
        {initiating ? (
          <div className="flex flex-col my-gap w-fit justify-center">
            <p>이미지를 불러오는 중입니다...</p>
            <Progress value={progress} className="w-full" />
          </div>
        ) : (
          <div className="grid my-gap sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
            {metadata
              .filter((item) => showNonApproved || (item.is_approved ?? true))
              .map((item, index) => (
                <div key={index} className="w-full h-fit">
                  <Link
                    href={{
                      pathname: `/post/view/${item.post_uuid ?? item.uuid}`,
                    }}
                  >
                    <PostThumbnail metadata={item} />
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
