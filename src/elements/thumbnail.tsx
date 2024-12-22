import * as React from 'react';
import { Post } from '@/app/api/post/route';
import { RoundBox } from '@/components/ui/RoundBox';

export const Thumbnail = ({ post }: {post: Post}) => {
  const thumbnailUrl = `${post.imageUrl}?width=300`
  return (
    <RoundBox>
        <img
          className="w-full rounded-lg shadow-lg"
          src={thumbnailUrl}
          alt={thumbnailUrl}
          loading="lazy"
        />
    </RoundBox>
  );
};
