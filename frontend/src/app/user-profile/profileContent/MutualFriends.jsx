import React from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MutualFriends = () => {
  const mutualFriends = [
    {
      _id: 1,
      username: "John Doe",
      profilePicture:
        "https://images.pexels.com/photos/30797307/pexels-photo-30797307/free-photo-of-smiling-man-with-grey-hair-and-sunglasses-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    },
    {
      _id: 2,
      username: "Jane Doe",
      profilePicture:
        "https://images.pexels.com/photos/2010922/pexels-photo-2010922.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
            Mutual Friends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mutualFriends.map((friend) => (
              <div
                key={friend?._id}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-start justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    {friend?.profilePicture !== "" ? (
                      <AvatarImage
                        src={friend?.profilePicture}
                        alt={friend?.username}
                      />
                    ) : (
                      <AvatarFallback className="dark:bg-gray-400">
                        {friend?.username.slice(0, 2)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-semibold dark:text-gray-100">
                      {friend?.username}
                    </p>
                    <p className="text-sm text-gray-400">2 followers</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <UserX className="h-4 w-4 mr-2" /> Unfollow
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MutualFriends;
