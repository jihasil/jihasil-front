import { nanoid } from "nanoid";

import { PostRepository } from "@/app/(back)/(adapter)/out/post-repository";
import { Post } from "@/app/(back)/domain/post";
import {
  bucket,
  cfUrl,
  postMediaPrefix,
  s3Client,
} from "@/app/(back)/shared/lib/s3";
import { Page, PageRequest } from "@/app/global/types/page-types";
import {
  CreatePostRequestDTO,
  PostEntry,
  PostFilter,
  PostKey,
} from "@/app/global/types/post-types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class PostService {
  private postRepository: PostRepository;

  constructor({ postRepository }: { postRepository: PostRepository }) {
    this.postRepository = postRepository;
  }

  getPostEntryListByFilter = async (
    pageRequest: PageRequest<PostKey>,
    filter: PostFilter,
  ) => {
    const postList = await this.postRepository.getPostListByFilter(
      pageRequest,
      filter,
    );

    if (postList) {
      const { data, ...pageData } = postList;

      const postEntries = data.map((post: Post) => {
        return post.toPostEntry();
      });

      const postEntryList: Page<PostEntry, PostKey> = {
        data: postEntries,
        ...pageData,
      };

      return postEntryList;
    } else {
      return postList;
    }
  };

  getPostById = async (postId: string) => {
    return await this.postRepository.getPostById(postId);
  };

  uploadThumbnail = async (fileName: string, contentType: string) => {
    const fileId = nanoid(21);
    const key = `${postMediaPrefix}/${fileId}/${fileName}`;

    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      });

      return {
        presignedUrl: await getSignedUrl(s3Client, command, {
          expiresIn: 60 * 60, // 1 hour
        }),
        fileUrl: `${cfUrl}/${bucket}/${key}`,
        fileKey: `${bucket}/${key}`,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  createPost = async (postRequestDTO: CreatePostRequestDTO) => {
    postRequestDTO["isDeleted"] = false;

    if (!postRequestDTO.postId) {
      // 새로 생성
      const created_at = new Date().toISOString();
      postRequestDTO.board = "main";
      postRequestDTO.createdAt = created_at;
      postRequestDTO.postId = nanoid(10);
    }

    const post = Post.fromJSON(postRequestDTO);

    return await this.postRepository.createPost(post);
  };

  deletePostById = async (postId: string) => {
    const post = await this.getPostById(postId);
    if (post) {
      await this.postRepository.deletePostById({
        board: post.board,
        created_at: post.createdAt,
      });
      return true;
    } else {
      return false;
    }
  };
}

export const postService = new PostService({
  postRepository: new PostRepository(),
});
