'use client';
import Masonry from '@mui/lab/Masonry';
import * as React from 'react';
import ImageModal from './modal';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect } from 'react';
import { Post } from '@/app/api/post/route';
import { Box, CircularProgress } from '@mui/material';

type PostResponseDTO = {
  posts: Post[],
  isLast: boolean
}

export default function ImageMasonry() {
  let lastCreatedAt = {
    createdAt: 'null',
  };
  let hasMore = true;

  const [open, setOpen] = React.useState(false);
  const [imageData, setImageData] = React.useState<Post[]>([]);
  const [image, setImage] = React.useState('');
  const masonryRef = React.useRef<any>(null);
  const handleClose = () => setOpen(false);
  const handleImage = (value: string) => {
    setImage(value);
    setOpen(true);
  };

  const fetchMore = async () => {
    console.log('Fetching more');
    const params = new URLSearchParams(lastCreatedAt);
    const response = fetch(`/api/post/?${params.toString()}`, {
      method: 'GET',
    });

    response
      .then(async response => {
        if (response.ok) {
          const { posts, isLast }: PostResponseDTO = await response.json();
          hasMore = !isLast;
          lastCreatedAt.createdAt = posts[posts.length - 1].createdAt;
          setImageData(prevState => [...prevState, ...posts]);
          console.log(posts);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const forceUpdateLayout = () => {
    if (masonryRef.current) {
      // masonryRef.current.update();
    }
  }

  // useEffect 내에서 비동기 함수 호출
  useEffect(() => {
    fetchMore();
  }, []);  // 빈 배열을 의존성 배열로 사용하여 최초 렌더링 시 한 번만 호출

  return (
    <div>
      <Box id="scrolableDiv" sx={{ width: 800, height: 800, overflowY: 'scroll' }}>
        <Masonry columns={{ xs: 3, sm: 4, md: 5 }} spacing={2} ref={masonryRef}>
          <InfiniteScroll next={fetchMore} loader={hasMore ? <CircularProgress /> : null} hasMore={hasMore}
                          dataLength={imageData.length}>
            {imageData.map((item: Post) => (
              <div key={item.postId}>
                <img
                  onClick={() => handleImage(item.imageUrl)}
                  src={`${item.imageUrl}?width=300`}
                  alt={item.imageUrl}
                  loading="lazy"
                  style={{
                    borderRadius: 4,
                    display: 'block',
                    width: '100%',
                    minHeight: 30,
                  }}
                />
              </div>
            ))}
            <ImageModal open={open} handleClose={handleClose} image={image} />
          </InfiniteScroll>
        </Masonry>
      </Box>
    </div>
  );
}