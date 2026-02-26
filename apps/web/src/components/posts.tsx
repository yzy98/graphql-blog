/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useQuery } from "urql";
import { graphql } from "@/gql/gql";

const postsQueryDocument = graphql(`
  query GetPosts {
    posts {
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

export function Posts() {
  const [{ data, fetching, error }] = useQuery({
    query: postsQueryDocument,
  });

  if (fetching) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="animate-pulse space-y-3" key={i}>
            <div className="h-7 w-2/3 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-4/5 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-destructive">Failed to load posts: {error.message}</p>
    );
  }

  if (!data?.posts?.length) {
    return <p className="text-muted-foreground">No posts yet.</p>;
  }

  return (
    <div className="space-y-10">
      {data.posts.map((post) => (
        <article className="group" key={post.id}>
          <Link className="block space-y-2" href={`/post/${post.id}`}>
            <h2 className="font-bold text-2xl tracking-tight group-hover:underline">
              {post.title}
            </h2>
            <p className="line-clamp-2 text-muted-foreground">{post.content}</p>
          </Link>
          {post.comments && post.comments.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-muted-foreground text-sm">
              <MessageCircle className="size-4" />
              <span>
                {post.comments.length} comment
                {post.comments.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
