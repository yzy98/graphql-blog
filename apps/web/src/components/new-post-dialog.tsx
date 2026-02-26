"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useMutation } from "urql";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { graphql } from "@/gql";
import { Input } from "./ui/input";

const createPostDocument = graphql(`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
    }
  }
`);

export const NewPostDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [{ fetching: submitting }, createPost] =
    useMutation(createPostDocument);

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!(title.trim() && content.trim())) {
      return;
    }
    await createPost({
      title: title.trim(),
      content: content.trim(),
    });
    setTitle("");
    setContent("");
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="font-bold text-4xl tracking-tight">Posts</h1>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Plus className="size-4" />
            Add Post
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Post</DialogTitle>
          </DialogHeader>
          <Input
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            value={title}
          />
          <Textarea
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            value={content}
          />
          <DialogFooter>
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={!(title.trim() && content.trim()) || submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
