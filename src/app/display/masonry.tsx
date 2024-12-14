'use client';
import * as React from 'react';
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid';
import { Box } from '@mui/material';
import { Post, PostResponseDTO } from '@/app/api/post/route';
import styles from './masonry.module.css';
import { Thumbnail } from '@/app/display/thumbnail';
import { useEffect } from 'react';
import PostView from '@/app/display/post-view';

export default function App() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState('');
  const handleClose = () => setOpen(false);
  const handleImage = (value: string) => {
    setImage(value);
    setOpen(true);
  };

  const fetchMore = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    console.log('Fetching more');
    console.log(hasMore);
    console.log(posts);
    const params = new URLSearchParams({ createdAt: posts.length > 0 ? posts[posts.length - 1].createdAt : '9999-99-99' });
    const response = await fetch(`/api/post/?${params.toString()}`, {
      method: 'GET',
    });

    try {
      if (response.ok) {
        const { posts, isLast }: PostResponseDTO = await response.json();
        setHasMore(!isLast);
        setPosts(prevState => [...prevState, ...posts]);
        console.log(posts);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('tlqkf');
  }, []);

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