import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Key, Page } from "@/app/global/types/page-types";

import { fetchR } from "../lib/request";

export const useInfiniteObjectList = <ObjectType, KeyType extends Key>(
  url: string,
  objectListKey: string,
  modifySearchParams?: (searchParams: URLSearchParams) => void | undefined,
  getPageSize: () => number = () => 30,
) => {
  const [objectList, setObjectList] = useState<ObjectType[]>([]);
  const [lastKey, setLastKey] = useState<KeyType | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isInitiated = useRef(false);

  const initiate = () => {
    setObjectList([]);
    setLastKey(null);
    setHasMore(true);
    setIsLoading(false);
  };

  const fetchMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    console.debug("Fetching more");
    console.debug(hasMore);

    const searchParams = new URLSearchParams();

    const pageSize = getPageSize();

    if (modifySearchParams) {
      modifySearchParams(searchParams);
    }

    if (lastKey) {
      const lastKeyJson = JSON.stringify(lastKey);
      searchParams.append("lastKey", lastKeyJson);
    }

    searchParams.append("pageSize", pageSize.toString());

    url += `?${searchParams.toString()}`;
    console.log(url.toString());

    const response = await fetchR(url.toString(), {
      method: "GET",
    });

    try {
      if (response.ok) {
        const { isLast, lastKey, data } = (await response.json()) as Page<
          ObjectType,
          KeyType
        >;
        setHasMore(!isLast && data.length < pageSize && !lastKey);
        setObjectList((prevState) => [...prevState, ...data]);
        console.log(data);
        console.info(lastKey);

        if (lastKey) {
          setLastKey(lastKey);
        }
      } else {
        setHasMore(false);
      }
    } catch (error: any) {
      console.error(error);
      const body = await response.json();
      toast.error(body.message);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, lastKey]);

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
    isInitiated.current = false;
    fetchMore().finally(() => {
      isInitiated.current = true;
    });
  }, [fetchMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [objectList, hasMore, isLoading, handleScroll]);

  return {
    setObjectList,
    objectList,
    isInitiated,
    initiate,
  };
};
