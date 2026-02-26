import { db } from "./client";
import { commentsTable, postsTable } from "./schema";

async function main() {
  // Delete all comments and posts
  await db.delete(commentsTable);
  await db.delete(postsTable);

  await db.insert(postsTable).values({
    title: "First Post",
    content: "This is my first post",
  });
  await db.insert(postsTable).values({
    title: "Second Post",
    content: "This is my second post",
  });
}

main().then(() => {
  console.log("Data seeded...");
});
