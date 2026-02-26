import { prisma } from "./client";

async function main() {
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});

  await prisma.post.create({
    data: {
      title: "First Post",
      content: "This is the first post",
      comments: {
        create: [
          {
            content: "This is the first comment on the first post",
          },
          {
            content: "This is the second comment on the first post",
          },
          {
            content: "This is the third comment on the first post",
          },
        ],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "Second Post",
      content: "This is the second post",
      comments: {
        create: [
          {
            content: "This is the first comment on the second post",
          },
          {
            content: "This is the second comment on the second post",
          },
          {
            content: "This is the third comment on the second post",
          },
        ],
      },
    },
  });
}

main().then(() => {
  console.log("Data seeded...");
});
