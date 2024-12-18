'use client';
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid';
import { Box } from '@mui/material';
import { Post, PostResponseDTO } from '@/app/api/post/route';
import styles from './masonry.module.css';
import { Thumbnail } from '@/app/display/thumbnail';
import PostView from '@/app/display/post-view';
import { useEffect, useState } from 'react';

export default function App() {
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

  useEffect(() => {}
    , [posts])

  const fetchMore = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    console.debug('Fetching more');
    console.debug(hasMore);
    console.info(posts);

    let url
    console.log(`lastKey: ${lastKey}`);
    if (!lastKey) {
      url = `/api/post`
    } else {
      const params = new URLSearchParams(lastKey)
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

  return (
      <Box className={styles.box}>
        <MasonryInfiniteGrid
          className={styles.container}
          align={'center'}
          gap={5}
          onRequestAppend={fetchMore}
        >
          {posts.map((post: Post, index: number) =>
            <div key={index} onClick={() => handleImage(post.imageUrl)}>
              <Thumbnail post={post} />
            </div>)
          }
        </MasonryInfiniteGrid>
        <PostView open={open} handleClose={handleClose} image={image} />
      </Box>
  );
}