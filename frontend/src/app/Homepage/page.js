"use client";

import React, { useState } from "react";

import PostCard from "../posts/PostCard";
import NewPostForm from "../posts/NewPostForm";
import StorySection from "../story/StorySection";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";

const HomePage = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  const posts = [
    {
      _id: 1,
      content: "This is a sample post.",
      mediaUrl:
        "https://images.pexels.com/photos/13003306/pexels-photo-13003306.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      mediaType: "image",
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
        {
          _id: 3,
          user: {
            _id: 3,
            text: "This is yet another sample comment.",
            username: "janedoe",
            createdAt: "22-03-2025",
          },
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex flex-1 pt-16">
        <LeftSideBar />
        <div className="flex-1 px-4 py-6 md:ml-64 lg:mr-64 lg:max-w-2xl xl:max-w-3xl mx-auto">
          <div className="lg:ml-2 xl:ml-28">
            <StorySection />
            <NewPostForm
              isPostFormOpen={isPostFormOpen}
              setIsPostFormOpen={setIsPostFormOpen}
            />
            <div className="mt-6 space-y-6 mb-4">
              {posts.map((post) => (
                <PostCard key={post?._id} post={post} />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-64 xl:w-80 fixed right-0 top-16 bottom-0 overflow-y-auto p-4">
          <RightSideBar />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
