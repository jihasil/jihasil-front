"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { LastPostKey, Metadata, Post, PostResponseDTO } from "@/app/utils/post";
import { Navigation } from "@/components/ui/navigation";
import { PostThumbnail } from "@/components/ui/post-thumbnail";
import { Progress } from "@/components/ui/progress";
import { issueDisplay } from "@/const/issue";

export default function Home() {
  let smSize: MediaQueryList;
  let lgSize: MediaQueryList;

  const getPageSize = () => {
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

  const changeIssue = (issueFilter: string) => {
    setMetadata([]);
    setLastPostKey(null);
    setHasMore(true);
    setIsLoading(false);
    setIssueFilter(issueFilter);
  };

  const fetchMore = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    console.debug("Fetching more");
    console.debug(hasMore);
    console.info(metadata);
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
        console.info(posts);
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
    smSize = window.matchMedia("(min-width: 640px)");
    lgSize = window.matchMedia("(min-width: 1024px)");

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
    <div className="flex flex-col gap-5">
      <div className="w-fit">
        <Navigation selects={issueDisplay} onValueChange={changeIssue} />
      </div>
      <div ref={galleryRef} className="flex overflow-y-auto justify-center">
        {initiating ? (
          <div className="flex flex-col gap-5 w-fit">
            <p>이미지를 불러오는 중입니다...</p>
            <Progress value={progress} className="w-full" />
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
            {metadata.map((item, index) => (
              <div key={index} className="mb-5 w-fit h-fit">
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
