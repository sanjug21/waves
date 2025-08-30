'use client';

import Link from "next/link";
import { UserDetails } from "@/types/types";

export default function UserCard({ user }: { user: UserDetails }) {
  const defImage = "/def.png";

  return (
    <div className="flex items-center gap-4  border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200 rounded-md">
      <Link href={`/home/profile/${user._id}`} className="shrink-0">
        <img
          src={user.dp || defImage}
          alt={`${user.name}'s profile picture`}
          className="w-12 h-12 rounded-full object-cover border border-gray-300 hover:scale-105 transition-transform duration-200"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/home/profile/${user._id}`}>
          <h2 className="text-base font-semibold text-gray-800 hover:text-blue-600 truncate transition-colors duration-200">
            {user.name}
          </h2>
        </Link>
        <p className="text-sm text-gray-500 truncate">{user.email}</p>
      </div>
    </div>
  );
}
