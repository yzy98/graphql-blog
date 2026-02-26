import { NewPostDialog } from "@/components/new-post-dialog";
import { Posts } from "@/components/posts";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl space-y-10 px-6 py-16">
      <NewPostDialog />
      <Posts />
    </main>
  );
}
