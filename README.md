# GraphQL Blog

A full-stack blog application built with GraphQL, featuring real-time comments via WebSocket subscriptions.

## Tech Stack

### Server (`apps/server`)

- **[GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)** — GraphQL server with WebSocket subscription support
- **[Pothos](https://pothos-graphql.dev/)** — Code-first GraphQL schema builder
- **[Prisma](https://www.prisma.io/)** — ORM with PostgreSQL
- **[graphql-ws](https://github.com/enisdenjo/graphql-ws)** — WebSocket protocol for subscriptions

### Web (`apps/web`)

- **[Next.js 16](https://nextjs.org/)** — React framework (App Router)
- **[urql](https://nearform.com/open-source/urql/)** — GraphQL client with subscription support
- **[shadcn/ui](https://ui.shadcn.com/)** — UI components (Radix + Tailwind CSS)
- **[GraphQL Code Generator](https://the-guild.dev/graphql/codegen)** — Typed GraphQL operations

### Tooling

- **pnpm** workspaces — Monorepo management
- **Biome** / **Ultracite** — Linting & formatting
- **Husky** + **lint-staged** — Pre-commit hooks

## Project Structure

```
graphql-blog/
├── apps/
│   ├── server/              # GraphQL API server
│   │   └── src/
│   │       ├── graphql/
│   │       │   ├── builder.ts       # Pothos schema builder
│   │       │   ├── context.ts       # GraphQL context & PubSub
│   │       │   ├── schema.ts        # Schema entrypoint
│   │       │   └── models/
│   │       │       ├── post.ts      # Post type, queries & mutations
│   │       │       └── comment.ts   # Comment type, mutations & subscriptions
│   │       ├── prisma/
│   │       │   ├── schema.prisma    # Database schema
│   │       │   └── seed.ts          # Seed data
│   │       └── index.ts             # HTTP + WebSocket server setup
│   └── web/                 # Next.js frontend
│       └── src/
│           ├── app/
│           │   ├── page.tsx             # Blog home (post listing)
│           │   └── post/[id]/page.tsx   # Individual post page
│           ├── components/
│           │   ├── posts.tsx            # Post list component
│           │   ├── post.tsx             # Single post with real-time comments
│           │   ├── new-post-dialog.tsx   # Create post dialog
│           │   ├── new-comment-dialog.tsx # Create comment dialog
│           │   └── providers/           # urql & theme providers
│           └── gql/                     # Generated GraphQL types
└── package.json
```

## Data Model

```
Post (1) ──── (N) Comment

Post: id, title, content, createdAt
Comment: id, content, createdAt, postId
```

## GraphQL API

### Queries

- `posts` — List all posts (with comments)
- `post(id: ID!)` — Get a single post by ID

### Mutations

- `createPost(title: String!, content: String!)` — Create a new post
- `createComment(postId: ID!, content: String!)` — Add a comment to a post

### Subscriptions

- `postCreated` — Real-time updates when a new post is created (via WebSocket)
- `commentCreated(postId: ID!)` — Real-time updates when a new comment is added to a specific post (via WebSocket)

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm >= 10
- PostgreSQL database

### Setup

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/server/.env.example apps/server/.env
# Edit .env with your DATABASE_URL

# Generate Prisma client
pnpm --filter @apps/server db:generate

# Seed the database (optional)
pnpm --filter @apps/server db:seed
```

### Development

```bash
# Run both server and web concurrently
pnpm dev:all

# Or run individually
pnpm dev:server   # http://localhost:4000/graphql
pnpm dev:web      # http://localhost:3000
```

### GraphQL Codegen

After modifying GraphQL operations in the frontend or changing the server schema, regenerate types:

```bash
# Make sure the server is running first
pnpm --filter @apps/web codegen
```

## License

MIT
