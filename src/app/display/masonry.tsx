'use client';
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid';
import { Box } from '@mui/material';
import { Post, PostResponseDTO } from '@/app/api/post/route';
import styles from './masonry.module.css';
import { Thumbnail } from '@/app/display/thumbnail';
import PostView from '@/app/display/post-view';
import { useState } from 'react';

export default function App() {
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
    console.debug(posts);
    const params = new URLSearchParams({ createdAt: posts.length > 0 ? posts[posts.length - 1].createdAt : '9999-99-99' });
    const response = await fetch(`/api/post/?${params.toString()}`, {
      method: 'GET',
    });

    try {
      if (response.ok) {
        const { posts, isLast }: PostResponseDTO = await response.json();
        setHasMore(!isLast);
        setPosts(prevState => [...prevState, ...posts]);
        console.debug(posts);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Box className={styles.box} style={{ width: '90vw', maxHeight: '80vh', overflowY: 'scroll' }}>
        <MasonryInfiniteGrid
          className={styles.container}
          align={'center'}
          gap={5}
          onRequestAppend={fetchMore}
        >
          {posts.map((post) =>
            <div key={post.postId} onClick={() => handleImage(post.imageUrl)}>
              <Thumbnail post={post} />
            </div>)
          }
        </MasonryInfiniteGrid>
        <PostView open={open} handleClose={handleClose} image={image} />
      </Box>
    </div>
  );
}