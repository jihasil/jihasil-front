import { PostRepository } from "@/app/(back)/(adapter)/out/post-repository";

class PostService {
  private postRepository: PostRepository;

  constructor({ postRepository }: { postRepository: PostRepository }) {
    this.postRepository = postRepository;
  }

  getPostById = async (postId: string) => {
    return await this.postRepository.getPostById(postId);
  };
}

export const postService = new PostService({
  postRepository: new PostRepository(),
});
