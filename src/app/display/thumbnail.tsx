import * as React from 'react';
import { Post } from '@/app/api/post/route';

export const Thumbnail = ({ post }: {post: Post}) => {
  const thumbnailUrl = `${post.imageUrl}?width=300`
  return (
    <div className="inline-block">
      <div className="rounded-md">
        <img
          className="w-full rounded-lg shadow-lg"
          src={thumbnailUrl}
          alt={thumbnailUrl}
          style={{
            width: '100%',
            borderRadius: 8,
          }}
        />
      </div>
    </div>);
};
