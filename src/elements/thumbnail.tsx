import * as React from 'react';
import { Post } from '@/app/api/post/route';

export const Thumbnail = ({ post }: {post: Post}) => {
  const thumbnailUrl = `${post.imageUrl}?width=300`
  return (
    <div className="flex justify-center items-center rounded-md">
        <img
          data-loaded='false'
          width="300px"
          height="auto"
          onLoad={event => {event.currentTarget.setAttribute('data-loaded', 'true')}}
          className="w-full rounded-lg data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/10"
          src={thumbnailUrl}
          alt={thumbnailUrl}
          loading="lazy"
        />
    </div>
  );
};
