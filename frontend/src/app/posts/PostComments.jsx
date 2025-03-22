"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Send } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const PostComments = ({ post }) => {
  const [showAllComments, setShowAllComments] = useState(false);

  const visibleComments = showAllComments
    ? post?.comments
    : post?.comments?.slice(0, 2);

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Comments</h3>
      <div className="max-h-60 overflow-y-auto pr-2">
        {visibleComments?.map((comment) => (
          <div key={comment?._id} className="flex items-start space-x-2 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage />
              <AvatarFallback className="dark:bg-gray-400">JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="rounded-lg p-2">
                <p className="font-bold text-sm">{comment?.user?.username}</p>
                <p className="text-sm">{comment?.user?.text}</p>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Button variant="ghost" size="sm">
                  Like
                </Button>
                <Button variant="ghost" size="sm">
                  Reply
                </Button>
                <span>{comment?.user?.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
        {post?.comments?.length > 2 && (
          <p
            className="w-40 mt-2 text-blue-500 dark:text-gray-300 cursor-pointer"
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments ? (
              <>
                Show Less <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Show All Comments <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <Avatar className="h-8 w-8">
          <AvatarImage />
          <AvatarFallback className="dark:bg-gray-400">JD</AvatarFallback>
        </Avatar>
        <Input
          placeholder="Write a comment..."
          className="flex-grow rounded-full h-12 dark:bg-[rgb(58,59,60)] "
        />
        <Button variant="ghost" size="icon" className="hover:bg-transparent">
          <Send className="h-5 w-5 text-blue-500" />
        </Button>
      </div>
    </div>
  );
};

export default PostComments;
