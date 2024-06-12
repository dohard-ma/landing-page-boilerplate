"use client";

import { getHtml } from "@/app/pdf/actions";
import { FixedSizeList as List } from "react-window";
import useSWRInfinite from "swr/infinite";

const fetcher = (key: string) => {
  const index = parseInt(key);
  return getHtml({ page: index + 1, height: window.innerHeight });
};

const Page = () => {
  const { data, size, setSize, isValidating } = useSWRInfinite(
    (index) => `${index}`,
    fetcher
  );

  const items = data ? data.flatMap((item) => item) : [];

  const loadMore = () => {
    if (!isValidating) {
      setSize(size + 1);
    }
  };

  return (
    <List
      height={150}
      itemCount={items.length}
      itemSize={35}
      width={300}
      onItemsRendered={({ visibleStopIndex }) => {
        if (visibleStopIndex === items.length - 1) {
          loadMore();
        }
      }}
    >
      {({ index, style }) => <div style={style}>{items[index]}</div>}
    </List>
  );
};

export default Page;

