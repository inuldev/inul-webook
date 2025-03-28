import toast from "react-hot-toast";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Cake,
  GraduationCap,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
  Rss,
} from "lucide-react";

import userStore from "@/store/userStore";
import { formatDateInDDMMYYY } from "@/lib/utils";
import { usePostStore } from "@/store/usePostStore";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import EditBio from "./profileContent/EditBio";
import PostsContent from "./profileContent/PostsContent";
import MutualFriends from "./profileContent/MutualFriends";

const ProfileDetails = ({
  activeTab,
  id,
  profileData,
  isOwner,
  fetchProfile,
}) => {
  const { user } = userStore();
  const [isEditBioModel, setIsEditBioModel] = useState(false);
  const [likePosts, setLikePosts] = useState(new Set());
  const {
    userPosts,
    fetchUserPost,
    handleLikePost,
    handleCommentPost,
    handleSharePost,
    handleDeletePost,
  } = usePostStore();

  useEffect(() => {
    if (id) {
      fetchUserPost(id);
    }
  }, [id, fetchUserPost]);

  useEffect(() => {
    const saveLikes = localStorage.getItem("likePosts");
    if (saveLikes) {
      setLikePosts(new Set(JSON.parse(saveLikes)));
    }
  }, []);

  const handleLike = async (postId) => {
    const updatedLikePost = new Set(likePosts);
    if (updatedLikePost.has(postId)) {
      updatedLikePost.delete(postId);
      toast.error("post unliked successfully");
    } else {
      updatedLikePost.add(postId);
      toast.success("post liked successfully");
    }
    setLikePosts(updatedLikePost);
    localStorage.setItem(
      "likePosts",
      JSON.stringify(Array.from(updatedLikePost))
    );

    try {
      await handleLikePost(postId);
      await fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error("failed to like or unlike the post");
    }
  };

  const handleDelete = async (postId) => {
    try {
      await handleDeletePost(postId);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post");
    }
  };

  const tabContent = {
    posts: (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[70%] space-y-6 mb-4">
          {userPosts?.map((post) => (
            <PostsContent
              key={userPosts?._id}
              post={post}
              isLiked={likePosts.has(post?._id)}
              onLike={() => handleLike(post?._id)}
              onComment={async (comment) => {
                await handleCommentPost(post?._id, comment.text);
                await fetchProfile();
              }}
              onShare={async () => {
                await handleSharePost(post?._id);
                await fetchProfile();
              }}
              onDelete={
                post.user._id === user?._id
                  ? () => handleDelete(post?._id)
                  : undefined
              }
            />
          ))}
        </div>
        <div className="w-full lg:w-[30%]">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
                Intro
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {profileData?.bio?.bioText}
              </p>
              <div className="space-y-2 mb-4 dark:text-gray-300">
                <div className="flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  <span> {profileData?.bio?.liveIn}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  <span>{profileData?.bio?.relationship}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{profileData?.bio?.hometown}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span>{profileData?.bio?.workplace}</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  <span>{profileData?.bio?.education}</span>
                </div>
              </div>
              <div className="flex items-center mb-4 dark:text-gray-300">
                <Rss className="w-5 h-5 mr-2" />
                <span>Followed by {profileData?.followingCount} people</span>
              </div>
              {isOwner && (
                <Button
                  className="w-full "
                  onClick={() => setIsEditBioModel(true)}
                >
                  Edit Bio
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    ),
    about: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
              About {profileData?.username}
            </h2>
            <div className="space-y-4 dark:text-gray-300">
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                <span>{profileData?.bio?.workplace}</span>
              </div>
              <div className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                <span>{profileData?.bio?.education}</span>
              </div>
              <div className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                <span>{profileData?.bio?.liveIn}</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                <span>{profileData?.bio?.relationship}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{profileData?.bio?.hometown}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <span>{profileData?.bio?.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <span>{profileData?.email}</span>
              </div>
              <div className="flex items-center">
                <Cake className="w-5 h-5 mr-2" />
                <span>
                  Birthday:{" "}
                  {profileData?.dateOfBirth
                    ? formatDateInDDMMYYY(profileData?.dateOfBirth)
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
    friends: (
      <MutualFriends id={id} isOwner={isOwner} fetchProfile={fetchProfile} />
    ),
    photos: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
              Photos
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {userPosts
                ?.filter(
                  (post) => post?.mediaType === "image" && post?.mediaUrl
                )
                .map((post) => (
                  <img
                    key={post?._id}
                    src={post?.mediaUrl}
                    alt="user_all_photos"
                    className="w-[200px] h-[150px] object-cover rounded-lg"
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
  };

  return (
    <div>
      {tabContent[activeTab] || null}
      <EditBio
        isOpen={isEditBioModel}
        onClose={() => setIsEditBioModel(false)}
        fetchProfile={fetchProfile}
        initialData={profileData?.bio || {}} // Ensure it's an object
        id={id}
      />
    </div>
  );
};

export default ProfileDetails;
