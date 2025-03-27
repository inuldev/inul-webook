"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import Loader from "@/lib/Loader";
import { fetchUserProfile } from "@/service/user.service";

import ProfileTabs from "@/app/user-profile/ProfileTabs";
import ProfileHeader from "@/app/user-profile/ProfileHeader";

const Page = () => {
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const result = await fetchUserProfile(id);
      setProfileData(result.profile);
      setIsOwner(result.isOwner);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (!profileData) {
    return <Loader />;
  }

  return (
    <div>
      <ProfileHeader
        profileData={profileData}
        setProfileData={setProfileData}
        isOwner={isOwner}
        id={id}
        fetchProfile={fetchProfile}
      />
      <ProfileTabs
        profileData={profileData}
        setProfileData={setProfileData}
        isOwner={isOwner}
        id={id}
        fetchProfile={fetchProfile}
      />
    </div>
  );
};

export default Page;
