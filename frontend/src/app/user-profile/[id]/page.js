"use client";

import React from "react";

import ProfileTabs from "@/app/user-profile/ProfileTabs";
import ProfileHeader from "@/app/user-profile/ProfileHeader";

const Page = () => {
  return (
    <div>
      <ProfileHeader />
      <ProfileTabs />
    </div>
  );
};

export default Page;
