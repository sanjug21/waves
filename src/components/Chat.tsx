'use client';

import { UserDetails } from "@/types/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/utils/api";
import { searchChatUser } from "@/hooks/chatHooks";
import { Spinner } from "./Util/Loader";
import { getSocket } from "@/lib/socket";

export default function Chat() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(false);


   useEffect(() => {
    const socket = getSocket();
     socket.emit("get_dummy");

     socket.on("receive_dummy", (data) => {
       console.log("🧪 Dummy data received:", data);
     });

     
   }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const response = await searchChatUser(searchQuery);
        setSearchResults(response.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery.trim()) {
      const delay = setTimeout(() => {
        fetchUserDetails();
      }, 300);
      return () => clearTimeout(delay);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <div className="max-w-xl mx-auto pt-4  ">
      <input
        type="text"
        placeholder="Search to chat"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-5 py-2.5 border border-[rgb(0,12,60)] rounded-3xl shadow-md bg-white text-[rgb(0,12,60)] placeholder-gray-400 focus:border-0 focus:outline-none focus:ring-2 focus:ring-[rgb(255,127,80)] transition-all duration-200"
        autoComplete="off"
      />



      {loading && <Spinner />}

      {searchResults.length > 0 && (
        <div className="space-y-3">
          {searchResults.map((user) => (
            <Link
              key={user._id}
              href={`/home/chat/${user._id}`}
              className="flex items-center gap-3 p-3 bg-white rounded-md shadow hover:bg-gray-50 transition"
            >
              <img
                src={user.dp || "/def.png"}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <span className="text-sm font-medium text-gray-800">{user.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
