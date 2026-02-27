"use client";

import { ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useQuery, useSubscription } from "urql";
import { graphql } from "@/gql";
import type { CommentCreatedSubscription } from "@/gql/graphql";
import { NewCommentDialog } from "./new-comment-dialog";

const postQueryDocument = graphql(`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      comments {
        id
        content
        createdAt
      }
    }
  }
`);

const commentCreatedDocument = graphql(`
  subscription CommentCreated($postId: ID!) {
    commentCreated(postId: $postId) {
      id
      content
      createdAt
    }
  } 
`);

interface Props {
  postId: string;
}

export const Post = ({ postId }: Props) => {
  const [{ data, fetching, error }] = useQuery({
    query: postQueryDocument,
    variables: { id: postId },
  });

  const [{ data: newComments }] = useSubscription(
    {
      query: commentCreatedDocument,
      variables: { postId },
    },
    (
      prev: CommentCreatedSubscription["commentCreated"][] | undefined,
      response
    ) => {
      return [response.commentCreated, ...(prev ?? [])];
    }
  );

  if (fetching) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-24 rounded bg-muted" />
          <div className="h-10 w-3/4 rounded bg-muted" />
          <div className="space-y-2 pt-4">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-destructive">Failed to load post: {error.message}</p>
      </main>
    );
  }

  if (!data?.post) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-muted-foreground">Post not found.</p>
      </main>
    );
  }

  const { post } = data;

  const queryComments = post.comments ?? [];
  const subOnlyComments = (newComments ?? [])
    .filter(
      (nc): nc is NonNullable<typeof nc> => nc !== null && nc !== undefined
    )
    .filter((nc) => !queryComments.some((qc) => qc.id === nc.id));
  const allComments = [...queryComments, ...subOnlyComments];

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        className="mb-8 inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
        href="/"
      >
        <ArrowLeft className="size-4" />
        Back to posts
      </Link>
      <article>
        <h1 className="font-bold text-3xl tracking-tight">{post.title}</h1>
        <div className="mt-6 whitespace-pre-wrap text-muted-foreground leading-relaxed">
          {post.content}
        </div>
      </article>
      <section className="mt-12 border-t pt-8">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold text-lg">
            <MessageCircle className="size-5" />
            {allComments.length} Comment
            {allComments.length !== 1 ? "s" : ""}
          </h2>

          <NewCommentDialog postId={postId} />
        </div>

        {allComments.length > 0 && (
          <ul className="mt-6 space-y-4">
            {allComments.map((comment) => (
              <li className="rounded-lg bg-muted/50 px-4 py-3" key={comment.id}>
                <p className="text-sm">{comment.content}</p>
                <time className="mt-1 block text-muted-foreground text-xs">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};
