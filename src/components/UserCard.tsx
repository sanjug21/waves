'use client';
import { UserDetails } from "@/types/types";

export default function UserCard({ user }: { user: UserDetails }) {
    
    const defImage = '/def.png';
    return (
       <div className="flex items-center space-x-4 border-t-2 border-b-2 p-1 border-[rgb(0,12,60)] bg-white/90  transition-colors duration-200">
      <img
        className="w-12 h-12 rounded-full object-cover bg-slate-700"
        src={user.dp || defImage}
        alt={`Profile picture of ${user.name}`}
      />
      <div className="flex-1 min-w-0">
        <h2 className="text-md font-semibold text-gray-800 truncate">{user.name}</h2>
        <p className="text-sm text-slate-400 truncate">{user.email}</p>
      </div>
      </div>
    );
}
