'use client';
import * as React from 'react';
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid';
import { Box } from '@mui/material';
import { Post, PostResponseDTO } from '@/app/api/post/route';
import styles from './masonry.module.css';

const Item = ({ num }: any) => {
  return (
    <div className={styles.item}>
      <div className={styles.thumbnail}>
        <img
          src={`${num}?width=300`}
          alt="egjs"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: 8,
          }}
        />
      </div>
    </div>);
};

export default function App() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchMore = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    console.log('Fetching more');
    const params = new URLSearchParams({ createdAt: posts.length > 0 ? posts[posts.length - 1].createdAt : '9999-99-99' });
    const response = fetch(`/api/post/?${params.toString()}`, {
      method: 'GET',
    });

    response
      .then(async response => {
        if (response.ok) {
          const { posts, isLast }: PostResponseDTO = await response.json();
          setHasMore(!isLast);
          setPosts(prevState => [...prevState, ...posts]);
          console.log(posts);
        }
      })
      .catch(err => {
        console.error(err);
      }).finally(() => setIsLoading(false));
  };

  return (
    <div>
      <Box className={styles.box} style ={{ width: '90vw', maxHeight: '80vh', overflowY: 'scroll'}} >
        <MasonryInfiniteGrid
          className={styles.container}
          align={"center"}
          gap={5}
          onRequestAppend={fetchMore}
        >
          {posts.map((item) => <Item key={item.postId} num={item.imageUrl} />)}
        </MasonryInfiniteGrid>
      </Box>
    </div>
  );
}