
import styles from '@/app/display/masonry.module.css';
import * as React from 'react';
import { Post } from '@/app/api/post/route';

export const Thumbnail = ({ post }: {post: Post}) => {
  const thumbnailUrl = `${post.imageUrl}?width=300`
  return (
    <div className={styles.item}>
      <div className={styles.thumbnail}>
        <img
          src={thumbnailUrl}
          alt={thumbnailUrl}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: 8,
          }}
        />
      </div>
    </div>);
};
