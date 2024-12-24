'use client';
import { LastPostKey, Post, PostResponseDTO } from '@/app/api/post/route';
import { Thumbnail } from '@/elements/thumbnail';
import PostView from '@/app/display/post-view';
import React, { useEffect, useRef, useState } from 'react';
import { RoundBox } from '@/components/ui/RoundBox';
import Link from 'next/link';

export default function Masonry() {
  const [lastPostKey, setLastPostKey] = useState<LastPostKey | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState('');

  const smSize = window.matchMedia('(min-width: 640px)')
  const lgSize = window.matchMedia('(min-width: 1024px)')

  const handleClose = () => setOpen(false);
  const handleImage = (value: string) => {
    setImage(value);
    setOpen(true);
  };

  const fetchMore = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    console.debug('Fetching more');
    console.debug(hasMore);
    console.info(posts);

    let url = "/api/post/"
    const searchParams = new URLSearchParams();

    if (lastPostKey) {
      const lastPostKeyJson = JSON.stringify(lastPostKey);
      searchParams.append("lastPostKey", lastPostKeyJson);
    }

    const isSmallScreen = smSize.matches; // sm 기준
    const isLargeScreen = lgSize.matches; // lg 기준
    console.log(isLargeScreen);

    let pageSize: number;
    if (isLargeScreen) {
      pageSize = 30;
    } else if (isSmallScreen) {
      pageSize = 20;
    } else {
      pageSize = 10;
    }

    searchParams.append("pageSize", pageSize.toString())

    url += `?${searchParams.toString()}`;
    console.log(url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
    });

    try {
      if (response.ok) {
        const { posts, isLast, LastEvaluatedKey }: PostResponseDTO = await response.json();
        setHasMore(!isLast);
        setPosts(prevState => [...prevState, ...posts]);
        console.info(posts);
        console.info(LastEvaluatedKey);
        setLastPostKey(LastEvaluatedKey);
      } else {
        setHasMore(false);
      }
    } catch (error) {
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
    fetchMore().catch((error) => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [posts, hasMore, isLoading]);

  return (
    <div ref={galleryRef} className="overflow-y-auto">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
          {posts.map((post, index) => (
            <div key={index} onClick={() => handleImage(post.imageUrl)} className="flex">
              <Thumbnail
                post={post}
              />
            </div>
          ))}
        </div>
      <PostView open={open} handleClose={handleClose} image={image} />
    </div>
  );
}