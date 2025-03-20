import React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const handleStoryClick = () => {};

const StoryCard = ({ isAddStory, story }) => {
  return (
    <>
      <Card
        className="w-40 h-60 relative overflow-hidden group cursor-pointer rounded-xl"
        onClick={isAddStory ? undefined : handleStoryClick}
      >
        <CardContent className="p-0 h-full">
          {isAddStory ? (
            <div className="w-full h-full flex flex-col">
              <div className="h-3/4 w-full relative border-b">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage />
                  <p className="w-full h-full flex justify-center items-center text-4xl dark:bg-gray-400">
                    ID
                  </p>
                </Avatar>
              </div>
              <div className="h-1/4 w-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Plus className="h-5 w-5 text-white" />
                </Button>
                <p className="text-xs font-semibold mt-1 dark:text-white">
                  Create Story
                </p>
              </div>
              <input type="file" accept="image/*,video/*" className="hidden" />
            </div>
          ) : (
            <>
              {story?.mediaType === "image" ? (
                <img
                  src={story?.mediaUrl}
                  alt={story?.user?.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={story?.mediaUrl}
                  alt={story?.user?.username}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 left-2 ring-2 ring-blue-500 rounded-full">
                <Avatar>
                  <AvatarImage />
                  <AvatarFallback className="dark:bg-gray-400">
                    ID
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="dark:text-white text-xs font-semibold truncate">
                  Inul Dev
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default StoryCard;
