"use client";

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

export const Test = () => {
  const [{ data }] = useQuery({
    query: postsQueryDocument,
  });
  return (
    <div>
      {data?.posts?.map((post) => (
        <div key={post.id}>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          <div>
            {post.comments?.map((comment) => (
              <p key={comment.id}>
                {comment.content}
                {comment.createdAt}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
