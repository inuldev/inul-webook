import React, { useState } from "react";
import { ChevronDown, ChevronUp, Send, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

import { formateDate } from "@/lib/utils";
import userStore from "@/store/userStore";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const PostComments = ({ post, onComment, commentInputRef }) => {
  const [comment, setComment] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onComment(comment);
    setComment("");
    setShowEmoji(false);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center space-x-2">
          <Input
            ref={commentInputRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-secondary/50 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-600"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowEmoji(!showEmoji)}
            className="dark:hover:bg-gray-700"
          >
            <Smile className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            type="submit"
            className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
          >
            Post
          </Button>
        </div>
        {showEmoji && (
          <div className="absolute right-0 top-12 z-50">
            <EmojiPicker
              theme="dark"
              onEmojiClick={(emoji) => {
                setComment((prev) => prev + emoji.emoji);
                setShowEmoji(false);
              }}
            />
          </div>
        )}
      </form>

      <ScrollArea className="h-[300px]">
        {post?.comments?.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </ScrollArea>
    </div>
  );
};

export default PostComments;
