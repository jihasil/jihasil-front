'use client'
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";

import Image from "next/image";
import {useState} from "react";
import MasonryInfiniteScroller from 'react-masonry-infinite';

export interface GroupData {
  nextGroupKey: number;
  count: number;
}

function getItems({ nextGroupKey, count }:GroupData) {
  const nextItems = [];
  const nextKey = nextGroupKey * count;

  for (let i = 0; i < count; ++i) {
    nextItems.push({
      groupKey: nextGroupKey,
      key: nextKey + i
    });
  }
  return nextItems;
}

const Item = ({ num }: any) => {
  return (
    <div style={{width: "250px"}}>
      <div>
        <img
          src={`https://naver.github.io/egjs-infinitegrid/assets/image/${(num % 33) + 1}.jpg`}
          alt="egjs"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: 8
          }}
          width={500}
          height={500}
        />
      </div>
      <div>{`egjs ${num}`}</div>
    </div>
  );
}

export default function Page() {
  const [items, setItems] = useState(() => getItems({ nextGroupKey: 0, count: 10 }));

  return (
    <MasonryInfiniteScroller
      pageStart={0}
      loadMore={(e) => {
        const nextGroupKey = (+e.groupKey! || 0);

        setItems([
          ...items,
          ...getItems({ nextGroupKey: nextGroupKey, count: 10 }),
        ]);
      }
    }
      hasMore={true}
      loader={<div>{'Loading ...'}</div>}>
      {items.map((item, index) => <Item data-grid-groupkey={item.groupKey} key={index} num={item.key} />)}
    </MasonryInfiniteScroller>
  );
}