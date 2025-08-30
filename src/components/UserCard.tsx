'use client';

import Link from "next/link";
import { useState } from "react";
import { UserDetails } from "@/types/types";
import ImagePreview from "@/components/ImagePreview"; 

export default function UserCard({ user }: { user: UserDetails }) {
  const defImage = "/def.png";
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      
      <div className="flex items-center gap-4 border border-gray-100 bg-white hover:bg-gray-50 transition-all duration-200 rounded-lg shadow-md z-[1] px-4 py-3">
        <button onClick={() => setShowPreview(true)} className="shrink-0 focus:outline-none">
          <img
            src={user.dp || defImage}
            alt={`${user.name}'s profile picture`}
            className="w-12 h-12 rounded-full object-cover border border-gray-300 hover:scale-105 transition-transform duration-200"
          />
        </button>

        <div className="flex-1 min-w-0">
          <Link href={`/home/profile/${user._id}`}>
            <h2 className="text-base font-semibold text-gray-800 hover:text-[rgb(255,127,80)] truncate transition-colors duration-200">
              {user.name}
            </h2>
          </Link>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
      </div>

      {showPreview && (
        <ImagePreview
          src={user.dp || defImage}
          alt={`${user.name}'s profile picture`}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
