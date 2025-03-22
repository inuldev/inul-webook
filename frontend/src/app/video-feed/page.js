"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import LeftSideBar from "../components/LeftSideBar";

import VideoCard from "./VideoCard";

const Page = () => {
  const videoPosts = [
    {
      _id: 1,
      mediaUrl:
        "https://videos.pexels.com/video-files/31169800/13316077_360_640_60fps.mp4",
      mediaType: "video",
      comments: [
        {
          _id: 1,
          user: {
            _id: 1,
            text: "This is a sample comment.",
            username: "johndoe",
            createdAt: "22-03-2025",
          },
        },
        {
          _id: 2,
          user: {
            _id: 2,
            text: "This is another sample comment.",
            username: "janedoe",
            createdAt: "22-03-2025",
          },
        },
      ],
    },
  ];

  return (
    <div className="mt-12 min-h-screen">
      <LeftSideBar />
      <main className="ml-0 md:ml-64 p-6">
        <Button variant="ghost" className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to feed
        </Button>
        <div className="max-w-3xl mx-auto">
          {videoPosts.map((post) => (
            <VideoCard key={post?._id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Page;
