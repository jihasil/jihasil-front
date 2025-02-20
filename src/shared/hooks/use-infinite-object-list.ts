import { useCallback, useEffect, useRef, useState } from "react";
import { fetchR } from "../lib/request";

export const useInfiniteObjectList = <ObjectType, KeyType>(
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
        const { isLast, LastEvaluatedKey, ...data } = await response.json();
        setHasMore(!isLast || data.length < pageSize);
        setObjectList((prevState) => [...prevState, ...data[objectListKey]]);
        console.log(data[objectListKey]);
        console.info(LastEvaluatedKey);
        setLastKey(LastEvaluatedKey);
      } else {
        setHasMore(false);
      }
    } catch (error: any) {
      console.error(error);
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
