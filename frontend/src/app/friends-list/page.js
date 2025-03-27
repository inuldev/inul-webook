"use client";

import toast from "react-hot-toast";
import React, { useEffect } from "react";

import { userFriendStore } from "@/store/userFriendsStore";
import { FriendCardSkeleton, NoFriendsMessage } from "@/lib/Skeleton";

import LeftSideBar from "../components/LeftSideBar";

import FriendRequest from "./FriendRequest";
import FriendsSuggestion from "./FriendsSuggestion";

const Page = () => {
  const {
    followUser,
    loading,
    fetchFriendRequest,
    fetchFriendSuggestion,
    deleteUserFromRequest,
    friendRequest,
    friendSuggestion,
  } = userFriendStore();

  useEffect(() => {
    fetchFriendRequest(), fetchFriendSuggestion();
  }, []);

  const handleAction = async (action, userId) => {
    try {
      if (action === "confirm") {
        await followUser(userId);
        toast.success("Friend added successfully");
      } else if (action === "delete") {
        await deleteUserFromRequest(userId);
        toast.success("Friend request rejected");
      }

      // Refresh both lists after any action
      await Promise.all([fetchFriendRequest(), fetchFriendSuggestion()]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to process friend request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[rgb(36,37,38)] ">
      <LeftSideBar />
      <main className="ml-0 md:ml-64 mt-16 p-6">
        <h1 className="text-2xl font-bold mb-6">Friend Requests</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <FriendCardSkeleton />
          ) : friendRequest.length === 0 ? (
            <NoFriendsMessage
              text="No Friend Requests"
              description="Looks like you are all caught up! Why not explore and connect with new people?"
            />
          ) : (
            friendRequest.map((friend) => (
              <FriendRequest
                key={friend._id}
                friend={friend}
                loading={loading}
                onAction={handleAction}
              />
            ))
          )}
        </div>

        <h1 className="text-2xl font-bold mb-6">People you may know</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <FriendCardSkeleton />
          ) : friendSuggestion.length === 0 ? (
            <NoFriendsMessage
              text="No Friend Suggestions"
              description="Looks like you are all caught up! Why not explore and connect with new people?"
            />
          ) : (
            friendSuggestion.map((friend) => (
              <FriendsSuggestion
                key={friend._id}
                friend={friend}
                loading={loading}
                onAction={handleAction}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;
