import { PostRepository } from "@/app/(back)/(adapter)/out/post-repository";
import { PageRequest } from "@/app/global/types/page-types";
import { PostFilter, PostKey } from "@/app/global/types/post-types";

class PostService {
  private postRepository: PostRepository;

  constructor({ postRepository }: { postRepository: PostRepository }) {
    this.postRepository = postRepository;
  }

  getPostMetadataListByFilter = async (
    pageRequest: PageRequest<PostKey>,
    filter: PostFilter,
  ) => {
    return await this.postRepository.getPostMetadataListByFilter(
      pageRequest,
      filter,
    );
  };

  getPostById = async (postId: string) => {
    return await this.postRepository.getPostById(postId);
  };
}

export const postService = new PostService({
  postRepository: new PostRepository(),
});
