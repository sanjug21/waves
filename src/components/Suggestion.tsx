"use client";

import getUserSuggestion from "@/hooks/getUserSuggestionHook";
import { followUnfollowUser } from "@/hooks/profileHooks";
import { UserDetails } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { TbRefresh } from "react-icons/tb";
import { useAppSelector } from "@/store/hooks";
import { LucideSendHorizontal } from "lucide-react";

export default function Suggestion() {
  const [allSuggestions, setAllSuggestions] = useState<UserDetails[]>([]);
  const [visibleSuggestions, setVisibleSuggestions] = useState<UserDetails[]>(
    []
  );
  const [postContent, setPostContent] = useState<string>("");
  const currentUser = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const defaultDp = "/def.png";
  const DISPLAY_LIMIT = 3;
const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const data = await getUserSuggestion();
      setAllSuggestions(data);
      setVisibleSuggestions(data.slice(0, DISPLAY_LIMIT));
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      await followUnfollowUser(userId);
      const updatedAll = allSuggestions.filter((user) => user._id !== userId);
      setAllSuggestions(updatedAll);

      const nextIndex = DISPLAY_LIMIT - 1;
      const nextUser = updatedAll[nextIndex];
      const updatedVisible = visibleSuggestions
        .filter((user) => user._id !== userId)
        .concat(nextUser ? [nextUser] : []);
      setVisibleSuggestions(updatedVisible);
    } catch (error) {
      console.error(`Failed to follow user ${userId}:`, error);
    }
  };

  const changeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostContent(e.target.value);
  };

  return (
    <div className="w-full max-w-full overflow-hidden flex flex-col gap-6 ">
      {/* Current User Section */}
      <div className=" rounded-xl bg-black/80 backdrop-blur-2xl border border-[rgb(0,12,60)] text-white shadow-md">
        <div className="flex rounded-t-xl p-2 items-center gap-4 mb-3 bg-gradient-to-tl from-orange-500 to-orange-700">
          <img
            src={currentUser?.dp || defaultDp}
            alt="Your profile"
            width={20}
            height={20}
            className="rounded-full object-cover w-10 h-10 border border-[rgb(0,12,60)]"
          />
          <h2 className="text-lg font-semibold">{currentUser?.name}</h2>
        </div>
        <div className="flex  text-white">
          <textarea
            ref={textareaRef}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            onFocus={() => {
              if (textareaRef.current) {
                textareaRef.current.style.height = "70px";
              }
            }}
            onBlur={() => {
              if (textareaRef.current && postContent.trim() === "") {
                textareaRef.current.style.height = "60px";
              }
            }}
            placeholder="Create a wave..."
            rows={2}
            className="resize-none w-full p-2 rounded-lg  placeholder-white focus:outline-none  transition-all duration-300 h-[40px] overflow-hidden"
          />
          {postContent.trim() !== "" && (
            <button className="flex justify-center items-center p-2 ">
              <LucideSendHorizontal className="text-orange-500 hover:text-orange-800 h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestion Section */}
      {visibleSuggestions.length > 0 && (
        <div className=" rounded-xl shadow-lg relative bg-black/80 backdrop-blur-md border border-white/20">
          <div className="flex items-center justify-between  border-b border-[rgb(0,12,60)] p-4">
            <h2 className="text-xl font-bold text-white drop-shadow">
              Suggested for you
            </h2>
            <div className="relative group">
              <button
                onClick={fetchSuggestions}
                className="p-2 rounded-md  text-white transition-colors focus:outline-none "
                disabled={loading}
              >
                <TbRefresh
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs bg-black/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Refresh
              </span>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-white/70">Loading...</p>
          ) : (
            <ul className="space-y-4 p-3">
              {visibleSuggestions.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center justify-between  border-gray-800 hover:bg-gray-800/60 transition-colors rounded-xl p-3"
                >
                  <div className="flex items-center gap-3 w-full">
                    <img
                      src={user.dp || defaultDp}
                      alt={`${user.name}'s profile picture`}
                      width={48}
                      height={48}
                      className="rounded-full object-cover w-12 h-12 border border-white/30"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate w-[160px] h-[20px] leading-[20px]">
                        {user.name}
                      </p>
                      <p className="text-sm text-white/70 truncate w-[160px] h-[18px] leading-[18px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollow(user._id)}
                    className="bg-gradient-to-br from-orange-700  to-purple-700 text-white font-bold py-2 px-4 rounded-full text-sm hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-orange-900"
                  >
                    Follow
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
