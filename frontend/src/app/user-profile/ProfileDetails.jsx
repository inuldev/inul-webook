import { motion } from "framer-motion";
import React, { useState } from "react";
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

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import EditBio from "./profileContent/EditBio";
import PostsContent from "./profileContent/PostsContent";
import MutualFriends from "./profileContent/MutualFriends";

const ProfileDetails = ({ activeTab }) => {
  const [isEditBioModel, setIsEditBioModel] = useState(false);

  const userPosts = [
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

  const tabContent = {
    posts: (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[70%] space-y-6 mb-4">
          {userPosts?.map((post) => (
            <PostsContent key={userPosts?._id} post={post} />
          ))}
        </div>
        <div className="w-full lg:w-[30%]">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
                Intro
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                This is a sample bio.
              </p>
              <div className="space-y-2 mb-4 dark:text-gray-300">
                <div className="flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  <span>Live in Konoha</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  <span>Single</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>From Wakanda Land</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span>Work at Jungle</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  <span>Studied at Konoha University</span>
                </div>
              </div>
              <div className="flex items-center mb-4 dark:text-gray-300">
                <Rss className="w-5 h-5 mr-2" />
                <span>Followed by 1 people</span>
              </div>
              <Button
                className="w-full"
                onClick={() => setIsEditBioModel(true)}
              >
                Edit Bio
              </Button>
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
              About Inul Dev
            </h2>
            <div className="space-y-4 dark:text-gray-300">
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                <span>Work at Jungle</span>
              </div>
              <div className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                <span>Studied at Konoha University</span>
              </div>
              <div className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                <span>Live in Konoha</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                <span>Single</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>From Wakanda Land</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <span>08123456789</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <span>inuldev@gmail.com</span>
              </div>
              <div className="flex items-center">
                <Cake className="w-5 h-5 mr-2" />
                <span>Birthday: 01/01/2001</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
    friends: <MutualFriends />,
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
      ></EditBio>
    </div>
  );
};

export default ProfileDetails;
