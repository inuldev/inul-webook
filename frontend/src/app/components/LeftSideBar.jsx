"use client";

import React from "react";
import {
  Home,
  Users,
  Video,
  User,
  MessageCircle,
  Bell,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const LeftSideBar = () => {
  return (
    <aside
      className={`fixed top-16 left-0 h-full w-64 p-4 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col z-50 md:z-0`}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        <nav className="space-y-4 flex-grow">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage />
              <AvatarFallback className="dark:bg-gray-400">ID</AvatarFallback>
            </Avatar>
            <span className="font-semibold">Inul Dev</span>
          </div>
          <Button variant="ghost" className="full justify-start">
            <Home className="mr-4" />
            Home Page
          </Button>
          <Button variant="ghost" className="full justify-start">
            <Users className="mr-4" />
            Friends List
          </Button>
          <Button variant="ghost" className="full justify-start">
            <Video className="mr-4" />
            Video Feed
          </Button>
          <Button variant="ghost" className="full justify-start">
            <User className="mr-4" />
            Profile
          </Button>
          <Button variant="ghost" className="full justify-start">
            <MessageCircle className="mr-4" />
            Messages
          </Button>
          <Button variant="ghost" className="full justify-start">
            <Bell className="mr-4" />
            Notification
          </Button>
        </nav>

        {/* footer section */}
        <div className="mb-16">
          <Separator className="my-4" />
          <div className="flex items-center space-x-2 mb-4 cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage />
              <AvatarFallback className="dark:bg-gray-400">ID</AvatarFallback>
            </Avatar>
            <span className="font-semibold">Inul Dev</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <Button variant="ghost" className="cursor-pointer -ml-4">
              <LogOut />
              <span className="ml-2 font-bold text-md">Logout</span>
            </Button>
            <p>Privacy · Terms · Advertising</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSideBar;
