import { nanoid } from "nanoid";

import { PostRepository } from "@/app/(back)/(adapter)/out/post-repository";
import { Post } from "@/app/(back)/domain/post";
import { Page, PageRequest } from "@/app/global/types/page-types";
import {
  CreatePostRequestDTO,
  PostEntry,
  PostFilter,
  PostKey,
} from "@/app/global/types/post-types";

class PostService {
  private postRepository: PostRepository;

  constructor({ postRepository }: { postRepository: PostRepository }) {
    this.postRepository = postRepository;
  }

  getPostEntryListByFilter = async (
    pageRequest: PageRequest<PostKey>,
    filter: PostFilter,
  ) => {
    console.log("terswt");
    const postList = await this.postRepository.getPostListByFilter(
      pageRequest,
      filter,
    );

    console.log("terswt");
    console.log(postList);

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
}

export const postService = new PostService({
  postRepository: new PostRepository(),
});
