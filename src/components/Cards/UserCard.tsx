"use client";

import Link from "next/link";
import { useState } from "react";
import ImagePreview from "@/components/Util/ImagePreview";
import { UserDetails } from "@/types/UserDetails.type";

export default function UserCard({ user }: { user: UserDetails }) {
  const defImage = "/def.png";
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      {/* 1. Increased bg-black/40: Creates a "plate" that blocks background noise.
          2. Added shadow-black/50: Gives the card physical depth.
      */}
      <div className="group relative flex items-center gap-4 bg-black/40 backdrop-blur-2xl border border-white/10 hover:border-blue-500/30 hover:bg-black/60 transition-all duration-300 rounded-[2rem] px-5 py-3.5 shadow-xl shadow-black/50">
        {/* PROFILE IMAGE */}
        <button
          onClick={() => setShowPreview(true)}
          className="shrink-0 focus:outline-none relative"
        >
          <img
            src={user.dp || defImage}
            alt={`${user.name}'s profile picture`}
            className="w-13 h-13 rounded-full object-cover border-2 border-white/20 group-hover:border-blue-400 transition-all duration-300 shadow-lg"
          />
        </button>

        {/* USER DETAILS */}
        <div className="flex-1 min-w-0">
          <Link href={`/home/profile/${user._id}`}>
            {/* Added drop-shadow-sm to text to prevent it from blending into light background spots */}
            <h2 className="text-[16px] font-black text-white hover:text-blue-400 truncate transition-colors duration-200 tracking-tight drop-shadow-sm">
              {user.name}
            </h2>
          </Link>
          <p className="text-[12px] font-bold text-slate-300 truncate tracking-wide opacity-80">
            {user.email}
          </p>
        </div>

        {/* ACTION BUTTON */}
        <div className="ml-2">
          <Link
            href={`/home/profile/${user._id}`}
            className="px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-black uppercase text-blue-300 tracking-widest hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Profile
          </Link>
        </div>
      </div>

      {showPreview && (
        <ImagePreview
          src={user.dp || defImage}
          alt={`${user.name}'s profile picture`}
          onClose={() => setShowPreview(false)}
          username={user.name}
        />
      )}
    </>
  );
}
