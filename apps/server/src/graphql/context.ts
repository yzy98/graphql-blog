import { createPubSub } from "graphql-yoga";
import type { Comment, Post } from "../prisma/generated/prisma/client";

export const pubsub = createPubSub<{
  POST_CREATED: [payload: { post: Post }];
  COMMENT_CREATED: [postId: number, payload: { comment: Comment }];
}>();

export interface GraphQLContext {
  pubsub: typeof pubsub;
}
