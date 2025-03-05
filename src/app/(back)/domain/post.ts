import {
  Serializable,
  SnakeCaseNamingStrategy,
  jsonObject,
  jsonProperty,
} from "ts-serializable";
import "reflect-metadata";

import { CategoryUnion } from "@/app/global/enum/category";
import { IssueUnion } from "@/app/global/enum/issue";
import { PostEntry, PostResponseDTO } from "@/app/global/types/post-types";

@jsonObject({ namingStrategy: new SnakeCaseNamingStrategy() })
export class Post extends Serializable {
  @jsonProperty(String)
  postId: string = "";

  @jsonProperty(String)
  createdAt: string = "";

  @jsonProperty(String)
  board: string = "";

  @jsonProperty(String)
  thumbnailUrl: string = "";

  @jsonProperty(String)
  title: string = "";

  @jsonProperty(String)
  subtitle: string = "";

  @jsonProperty(String)
  category: CategoryUnion = "magazine";

  @jsonProperty(String)
  author: string = "";

  @jsonProperty(String)
  issueId: IssueUnion = "none";

  @jsonProperty(Boolean)
  isApproved: boolean = false;

  @jsonProperty(Boolean)
  isDeleted: boolean = false;

  @jsonProperty(String)
  userId: string = "";

  @jsonProperty(String)
  html: string = "";

  toPostEntry(): PostEntry {
    return {
      postId: this.postId,
      thumbnailUrl: this.thumbnailUrl,
      title: this.title,
      subtitle: this.subtitle,
      category: this.category,
      author: this.author,
      issueId: this.issueId,
      isApproved: this.isApproved,
    };
  }

  toPostResponseDTO(): PostResponseDTO {
    return {
      author: this.author,
      board: this.board,
      category: this.category,
      createdAt: this.createdAt,
      html: this.html,
      isApproved: this.isApproved,
      isDeleted: this.isDeleted,
      issue_id: this.issueId,
      post_id: this.postId,
      subtitle: this.subtitle,
      thumbnailUrl: this.thumbnailUrl,
      userId: this.userId,
      title: this.title,
    };
  }
}
