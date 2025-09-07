"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getUserConversations, searchChatUser } from "@/hooks/chatHooks";
import { getSocket } from "@/lib/socket";
import { useAppSelector } from "@/store/hooks";
import { ConversationDetails, UserDetails } from "@/types/types";
import { Spinner } from "./Util/Loader";
import ConversationCard from "./Cards/ConversationCard";
import ConversationCardSkeleton from "./skeleton/ConversationCardSkelton";

export default function UserConversations() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserDetails[]>([]);
  const [conversations, setConversations] = useState<ConversationDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useAppSelector((state) => state.auth.user);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser?._id) return;
    const socket = getSocket();
    socket.emit("join", currentUser._id);

    const loadInitialConversations = async () => {
      setLoading(true);
      try {
        const initial = await getUserConversations();
        const sorted = [...initial].sort((a, b) => {
          if (a.lastMessageSeen === b.lastMessageSeen) {
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          }
          return a.lastMessageSeen ? 1 : -1;
        });
        setConversations(sorted);
      } catch (err) {
        console.error("Initial fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialConversations();

    socket.on("conversation", (updatedList: ConversationDetails[]) => {
      const sorted = [...updatedList].sort((a, b) => {
        if (a.lastMessageSeen === b.lastMessageSeen) {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }
        return a.lastMessageSeen ? 1 : -1;
      });
      setConversations(sorted);
    });

    return () => {
      socket.off("conversation");
    };
  }, [currentUser?._id]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto pt-4 ">
      <div ref={searchRef}>
        <input
          type="text"
          placeholder="Search to chat"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-5 py-2.5 border border-[rgb(0,12,60)] rounded-3xl shadow-md bg-white text-[rgb(0,12,60)] placeholder-gray-400 focus:border-0 focus:outline-none focus:ring-2 focus:ring-[rgb(255,127,80)] transition-all duration-200"
          autoComplete="off"
        />

        {loading && conversations.length === 0 && (
          <div className="mt-3 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <ConversationCardSkeleton key={i} />
            ))}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-3 mt-2 rounded-xl backdrop-blur-lg bg-orange-200 text-white  p-3">
            {searchResults
              .filter((user) => {
                return !conversations.some(
                  (conv) => conv.receiverId._id === user._id
                );
              })
              .map((user) => (
                <Link key={user._id} href={`/home/chat/${user._id}`}>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-md shadow hover:bg-orange-100 transition">
                    <img
                      src={user.dp || "/def.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {user.name}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>

      {conversations.length > 0 && (
        <div className="mt-2 space-y-3">
          {conversations.map((conv) => {
            return <ConversationCard key={conv._id} conversation={conv} />;
          })}
        </div>
      )}
    </div>
  );
}
