"use client";

import { useState } from "react";
import ProfilePosts from "@/components/Profile/ProfilePosts";
import UserProfile from "@/components/Profile/UserProfile";
import UserFollowings from "@/components/Profile/UserFollowings";
import UserFollowers from "@/components/Profile/UserFollowers";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [activeTab, setActiveTab] = useState<
    "posts" | "following" | "followers"
  >("posts");

  const tabs = [
    { id: "posts", label: "Posts" },
    { id: "following", label: "Following" },
    { id: "followers", label: "Followers" },
  ] as const;

  return (
    <div className="w-full h-full text-white font-sans min-h-[calc(100vh-75px)] pb-20">
      {/* 1. PROFILE HEADER */}
      <UserProfile id={id} />

      {/* 2. STICKY GLASS NAVIGATION 
          - Changed to uppercase font-black for premium look
          - Removed rounded-t-lg to match the container's sharp edges
      */}
      <div className="sticky top-0 z-30 bg-black/40 backdrop-blur-md border-y border-white/10 flex justify-around px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative py-4 px-6 text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${
              activeTab === tab.id
                ? "text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.label}

            {/* Animated Active Indicator Line */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-in fade-in zoom-in-x duration-500" />
            )}
          </button>
        ))}
      </div>

      {/* 3. CONTENT AREA 
          - No margin-top to ensure the glass container sits flush against the nav
      */}
      <div className="animate-in fade-in duration-700">
        {activeTab === "posts" && <ProfilePosts id={id} />}
        {activeTab === "following" && <UserFollowings id={id} />}
        {activeTab === "followers" && <UserFollowers id={id} />}
      </div>
    </div>
  );
}
