import { useCallback, useEffect, useRef, useState } from "react";

export const useInfiniteObjectList = <T, R>(
  url: string,
  objectListKey: string,
  modifySearchParams?: (searchParams: URLSearchParams) => void | undefined,
  getPageSize: () => number = () => 30,
) => {
  const [objectList, setObjectList] = useState<T[]>([]);
  const [lastPostKey, setLastPostKey] = useState<R | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isInitiated = useRef(false);

  const initiate = () => {
    setObjectList([]);
    setLastPostKey(null);
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

    if (lastPostKey) {
      const lastPostKeyJson = JSON.stringify(lastPostKey);
      searchParams.append("lastPostKey", lastPostKeyJson);
    }

    searchParams.append("pageSize", pageSize.toString());

    url += `?${searchParams.toString()}`;
    console.log(url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    try {
      if (response.ok) {
        const { isLast, LastEvaluatedKey, ...data } = await response.json();
        setHasMore(!isLast);
        setObjectList((prevState) => [...prevState, ...data[objectListKey]]);
        console.log(data[objectListKey]);
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
  }, [hasMore, isLoading, lastPostKey]);

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
    objectList,
    isInitiated,
    initiate,
  };
};
