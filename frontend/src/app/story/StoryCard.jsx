"use client";

import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Plus, Trash } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import userStore from "@/store/userStore";
import { usePostStore } from "@/store/usePostStore";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import ShowStoryPreview from "./ShowStoryPreview";

const StoryCard = ({ story, isAddStory }) => {
  const fileInputRef = useRef(null);
  const [fileType, setFileType] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewStory, setIsNewStory] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { user } = userStore();
  const { handleCreateStory, handleDeleteStory, fetchStoryPost } =
    usePostStore();

  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const userStoryPlaceholder = story?.user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/quicktime",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please use JPG, PNG, WEBP, GIF or MP4");
      return;
    }

    setSelectedFile(file);
    setFileType(file.type.startsWith("video") ? "video" : "image");
    setFilePreview(URL.createObjectURL(file));
    setIsNewStory(true);
    setShowPreview(true);
    e.target.value = "";
  };

  useEffect(() => {
    fetchStoryPost();
  }, [fetchStoryPost]);

  const handleCreateStoryPost = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("media", selectedFile);
      await handleCreateStory(formData);
      await fetchStoryPost();
      toast.success("Story created successfully!");
      resetStoryState();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create story");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePreview = () => {
    resetStoryState();
  };

  const resetStoryState = () => {
    setShowPreview(false);
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
    setFileType(null);
    setIsNewStory(false);
  };

  const handleStoryClick = () => {
    if (!story?.mediaUrl) return;
    setFilePreview(story.mediaUrl);
    setFileType(story.mediaType);
    setIsNewStory(false);
    setShowPreview(true);
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent story click event
    try {
      await handleDeleteStory(story._id);
      toast.success("Story deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete story");
    }
  };

  useEffect(() => {
    if (story?.remainingTime) {
      const updateRemainingTime = () => {
        const hours = Math.floor(story.remainingTime / 3600);
        const minutes = Math.floor((story.remainingTime % 3600) / 60);

        if (hours > 0) {
          setTimeLeft(`${hours}h left`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m left`);
        } else {
          setTimeLeft("Expiring soon");
        }

        story.remainingTime -= 1;
      };

      updateRemainingTime();
      const timer = setInterval(updateRemainingTime, 1000);

      return () => clearInterval(timer);
    }
  }, [story]);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className="w-40 h-60 relative overflow-hidden rounded-xl"
          onClick={isAddStory ? undefined : handleStoryClick}
        >
          {/* Add delete button if user owns the story */}
          {!isAddStory && story?.user?._id === user?._id && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4 text-red-500 shadow-lg" />
            </Button>
          )}
          {/* Add time remaining indicator */}
          {!isAddStory && timeLeft && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded-full">
              <span className="text-xs text-white">{timeLeft}</span>
            </div>
          )}
          <CardContent className="p-0 h-full">
            {isAddStory ? (
              <div className="w-full h-full flex flex-col">
                <div
                  className="h-3/4 w-full relative border-b hover:bg-black hover:bg-opacity-20 transition-all duration-200"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Avatar className="w-full h-full rounded-none">
                    {user?.profilePicture ? (
                      <AvatarImage
                        src={user.profilePicture}
                        alt={user.username}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex justify-center items-center">
                        <span className="text-4xl text-gray-400">
                          {userPlaceholder}
                        </span>
                      </div>
                    )}
                  </Avatar>
                  <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-200" />
                </div>
                <div className="h-1/4 w-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="h-5 w-5 text-white" />
                  </Button>
                  <p className="text-xs font-semibold mt-1 dark:text-white">
                    Create Story
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="relative w-full h-full group">
                {story?.mediaType === "image" ? (
                  <img
                    src={story.mediaUrl}
                    alt={story.user?.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={story.mediaUrl}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
                <div className="absolute top-2 left-2 ring-2 ring-blue-500 rounded-full">
                  <Avatar className="w-8 h-8">
                    {story?.user?.profilePicture ? (
                      <AvatarImage
                        src={story.user.profilePicture}
                        alt={story.user.username}
                      />
                    ) : (
                      <AvatarFallback className="bg-gray-400 text-white">
                        {userStoryPlaceholder}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-orange-500 text-opacity-80 text-xs font-semibold truncate drop-shadow-lg">
                    {story?.user?.username}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {showPreview && (
        <ShowStoryPreview
          file={filePreview}
          fileType={fileType}
          onClose={handleClosePreview}
          onPost={handleCreateStoryPost}
          isNewStory={isNewStory}
          username={isNewStory ? user?.username : story?.user?.username}
          avatar={
            isNewStory ? user?.profilePicture : story?.user?.profilePicture
          }
          isLoading={loading}
        />
      )}
    </>
  );
};

export default StoryCard;
