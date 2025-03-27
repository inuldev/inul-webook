import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState, useCallback } from "react";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  Maximize2,
  Loader,
  Play,
  Pause,
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

import PostComments from "./PostComments";

const PostCard = ({ post, isLiked, onShare, onComment, onLike }) => {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const commentInputRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    toast.error("Failed to load video");
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  // Intersection Observer for video autoplay
  const handleVideoIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        videoRef.current?.play().catch(() => {});
      } else {
        videoRef.current?.pause();
      }
    });
  }, []);

  React.useEffect(() => {
    if (post?.mediaType === "video" && videoRef.current) {
      const observer = new IntersectionObserver(handleVideoIntersection, {
        threshold: 0.5,
      });
      observer.observe(videoRef.current);
      return () => observer.disconnect();
    }
  }, [handleVideoIntersection, post?.mediaType]);

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
      ref={cardRef}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6 dark:text-white">
          {/* User Info Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 cursor-pointer">
              <Avatar>
                {post?.user?.profilePicture ? (
                  <AvatarImage
                    src={post?.user?.profilePicture}
                    alt={post?.user?.username}
                  />
                ) : (
                  <AvatarFallback className="dark:bg-gray-400">
                    {userPostPlaceholder}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-semibold dark:text-white">
                  {post?.user?.username}
                </p>
                <p className="text-xs text-gray-500">
                  {formateDate(post?.createdAt)}
                </p>
              </div>
            </div>
            <Button variant="ghost" className="dark:hover:bg-gray-500">
              <MoreHorizontal className="dark:text-white h-4 w-4" />
            </Button>
          </div>

          {/* Post Content */}
          <p className="mb-4 whitespace-pre-wrap">{post?.content}</p>

          {/* Media Content */}
          {post?.mediaUrl && (
            <div className="relative rounded-lg overflow-hidden mb-4">
              {post.mediaType === "image" ? (
                <img
                  src={post?.mediaUrl}
                  alt="post_image"
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                />
              ) : (
                <div className="relative group">
                  <video
                    ref={videoRef}
                    className="w-full h-auto rounded-lg max-h-[500px]"
                    playsInline
                    muted={isMuted}
                    onLoadedData={handleVideoLoad}
                    onError={handleVideoError}
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    loop
                    loading="lazy"
                  >
                    <source src={post?.mediaUrl} type="video/mp4" />
                    Your browser does not support the video tag
                  </video>
                  <div className="absolute bottom-4 right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70"
                      onClick={() => {
                        if (videoRef.current) {
                          if (videoRef.current.paused) {
                            videoRef.current.play();
                          } else {
                            videoRef.current.pause();
                          }
                        }
                      }}
                    >
                      {isLoading ? (
                        <Loader className="h-4 w-4 animate-spin text-white" />
                      ) : (
                        <span className="sr-only">Loading...</span>
                      )}
                      {isPlaying ? (
                        <Pause className="h-4 w-4 text-white" />
                      ) : (
                        <Play className="h-4 w-4 text-white" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4 text-white" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-white" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70"
                      onClick={toggleFullscreen}
                    >
                      <Maximize2 className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Engagement Stats */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hover:underline cursor-pointer">
              {post?.likeCount} likes
            </span>
            <div className="flex gap-3">
              <span
                className="text-sm text-gray-500 dark:text-gray-400 hover:underline cursor-pointer"
                onClick={() => setShowComments(!showComments)}
              >
                {post?.commentCount} comments
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {post?.shareCount} shares
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <Separator className="mb-2 dark:bg-gray-400" />
          <div className="flex justify-between mb-2">
            <Button
              variant="ghost"
              className={`flex-1 dark:hover:bg-gray-600 ${
                isLiked ? "text-blue-600" : ""
              }`}
              onClick={onLike}
            >
              <ThumbsUp className="mr-2 h-4 w-4" /> Like
            </Button>
            <Button
              variant="ghost"
              className="flex-1 dark:hover:bg-gray-600"
              onClick={handleCommentClick}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Comment
            </Button>

            {/* Share Dialog */}
            <Dialog
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 dark:hover:bg-gray-500"
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share This Post</DialogTitle>
                  <DialogDescription>
                    Choose where you want to share this post
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                  <Button
                    onClick={() => handleShare("facebook")}
                    className="bg-[#1877f2] hover:bg-[#1877f2]/90"
                  >
                    Share on Facebook
                  </Button>
                  <Button
                    onClick={() => handleShare("twitter")}
                    className="bg-[#1da1f2] hover:bg-[#1da1f2]/90"
                  >
                    Share on Twitter
                  </Button>
                  <Button
                    onClick={() => handleShare("linkedin")}
                    className="bg-[#0a66c2] hover:bg-[#0a66c2]/90"
                  >
                    Share on LinkedIn
                  </Button>
                  <Button onClick={() => handleShare("copy")}>Copy Link</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Comments Section */}
          <Separator className="mb-2 dark:bg-gray-400" />
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
