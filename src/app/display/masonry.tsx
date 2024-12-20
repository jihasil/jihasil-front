'use client';
import { Post, PostResponseDTO } from '@/app/api/post/route';
import { Thumbnail } from '@/app/display/thumbnail';
import PostView from '@/app/display/post-view';
import { useEffect, useRef, useState } from 'react';

export default function Masonry() {
  const [lastKey, setLastKey] = useState<any | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState('');
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

    let url;
    console.log(`lastKey: ${lastKey}`);
    if (!lastKey) {
      url = `/api/post`;
    } else {
      const params = new URLSearchParams(lastKey);
      url = `/api/post/?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
    });

    try {
      if (response.ok) {
        const { posts, isLast, LastEvaluatedKey }: PostResponseDTO = await response.json();
        setHasMore(!isLast);
        setPosts(prevState => [...prevState, ...posts]);
        console.info(posts);
        console.info(LastEvaluatedKey);
        setLastKey(LastEvaluatedKey);
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
    const gallery = galleryRef.current;

    if (gallery) {
      const { scrollTop, scrollHeight, clientHeight } = gallery;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        await fetchMore();
      }
    }
  };

  useEffect(() => {
    fetchMore().catch((error) => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    const gallery = galleryRef.current;

    if (gallery) {
      gallery.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (gallery) {
        gallery.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isLoading]);

  return (
    <div className="w-full flex justify-center overflow-hidden">
      <div ref={galleryRef} className="w-full overflow-y-auto flex flex-col">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 ">
          {posts.map((post, index) => (
            <div key={index} onClick={() => handleImage(post.imageUrl)}>
              <Thumbnail
                post={post}
              />
            </div>
          ))}
        </div>
      </div>
      <PostView open={open} handleClose={handleClose} image={image} />
    </div>
  );
}