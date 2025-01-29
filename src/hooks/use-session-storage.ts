"use client";

import { useState } from "react";

export const useSessionStorage = <T>(key: string, value: T) => {
  const [getItem, setStoredItem] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const item = sessionStorage.getItem(key);
      if (item) {
        // sessionStorage에 값이 있다면 그 값을 사용
        return JSON.parse(item);
      } else {
        // session에 값이 없을 때 초기값으로 사용
        // 초기값을 sessionStorage에 저장
        sessionStorage.setItem(key, JSON.stringify(value));
        return value;
      }
    }
  });

  const setItem = (value: T) => {
    setStoredItem(value); // 1. 자체 state 변경
    sessionStorage.setItem(key, JSON.stringify(value)); // 2. 세션 스토리지 내 data 변경
  };

  return [getItem, setItem] as const;
};
