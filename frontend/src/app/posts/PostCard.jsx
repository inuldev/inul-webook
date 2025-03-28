import toast from "react-hot-toast";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  Trash,
} from "lucide-react";

import { formateDate } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import PostComments from "./PostComments";

const PostCard = ({
  post,
  isLiked,
  onShare,
  onComment,
  onLike,
  onDelete,
  currentUser,
}) => {
  const commentInputRef = useRef(null);
  const [showComments, setShowComments] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleCommentClick = () => {
    setShowComments(true);
    setTimeout(() => {
      commentInputRef?.current?.focus();
    }, 0);
  };

  const userPostPlaceholder = post?.user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const generateSharedLink = () => {
    return `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${post?._id}`;
  };

  const handleShare = async (platform) => {
    const url = generateSharedLink();
    try {
      switch (platform) {
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              url
            )}`,
            "_blank"
          );
          break;
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
              url
            )}&text=${encodeURIComponent(post?.content || "")}`,
            "_blank"
          );
          break;
        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              url
            )}`,
            "_blank"
          );
          break;
        case "copy":
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
          break;
        default:
          return;
      }
      onShare();
      setIsShareDialogOpen(false);
    } catch (error) {
      toast.error("Failed to share post");
    }
  };

  return (
    <motion.div
      key={post?._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full bg-card dark:bg-[#242526] dark:border-gray-700">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <Avatar>
                {post?.user?.profilePicture ? (
                  <AvatarImage
                    src={post?.user?.profilePicture}
                    alt={post?.user?.username}
                  />
                ) : (
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-600">
                    {userPostPlaceholder}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">
                  {post?.user?.username}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formateDate(post?.createdAt)}
                </p>
              </div>
            </div>
            {onDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="dark:bg-[#242526] dark:border-gray-700"
                >
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={onDelete}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="my-4 text-foreground">{post?.content}</p>
          {post?.mediaUrl && post.mediaType === "image" && (
            <img
              src={post?.mediaUrl}
              alt="post_image"
              className="w-full h-auto rounded-lg mb-4"
            />
          )}
          {post?.mediaUrl && post.mediaType === "video" && (
            <video controls className="w-full h-[500px] rounded-lg mb-4">
              <source src={post?.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag
            </video>
          )}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground hover:underline cursor-pointer">
              {post?.likeCount} likes
            </span>
            <div className="flex gap-3">
              <span
                className="text-sm text-muted-foreground hover:underline cursor-pointer"
                onClick={() => setShowComments(!showComments)}
              >
                {post?.commentCount} comments
              </span>
              <span className="text-sm text-muted-foreground hover:underline cursor-pointer">
                {post?.shareCount} share
              </span>
            </div>
          </div>
          <Separator className="mb-2 dark:bg-gray-700" />
          <div className="flex justify-between mb-2">
            <Button
              variant="ghost"
              className={`flex-1 dark:hover:bg-gray-700 dark:text-gray-200 ${
                isLiked ? "text-blue-600 dark:text-blue-500" : ""
              }`}
              onClick={onLike}
            >
              <ThumbsUp className="mr-2 h-4 w-4" /> Like
            </Button>
            <Button
              variant="ghost"
              className="flex-1 dark:hover:bg-gray-700 dark:text-gray-200"
              onClick={handleCommentClick}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Comment
            </Button>

            <Dialog
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 dark:hover:bg-gray-700 dark:text-gray-200"
                  onClick={onShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent className="dark:bg-[#242526] dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    Share This Post
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Choose where you want to share this post
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                  <Button
                    onClick={() => handleShare("facebook")}
                    className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                  >
                    Share on Facebook
                  </Button>
                  <Button
                    onClick={() => handleShare("twitter")}
                    className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                  >
                    Share on Twitter
                  </Button>
                  <Button
                    onClick={() => handleShare("linkedin")}
                    className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                  >
                    Share on Linkedin
                  </Button>
                  <Button
                    onClick={() => handleShare("copy")}
                    className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                  >
                    Copy Link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Separator className="mb-2 dark:bg-gray-700" />
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PostComments
                  post={post}
                  onComment={onComment}
                  commentInputRef={commentInputRef}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostCard;
