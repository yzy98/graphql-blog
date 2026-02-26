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

const createCommentDocument = graphql(`
  mutation CreateComment($postId: ID!, $content: String!) {
    createComment(postId: $postId, content: $content) {
      id
      content
      createdAt
    }
  }
`);

interface Props {
  postId: string;
}

export const NewCommentDialog = ({ postId }: Props) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  const [{ fetching: submitting }, createComment] = useMutation(
    createCommentDocument
  );

  const handleCancel = () => {
    setContent("");
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      return;
    }
    await createComment({ postId, content: content.trim() });
    setContent("");
    setOpen(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="size-4" />
          Add Comment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Comment</DialogTitle>
        </DialogHeader>
        <Textarea
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          value={content}
        />
        <DialogFooter>
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button
            disabled={!content.trim() || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
