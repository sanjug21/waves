"use client";

import React, { useEffect, useRef } from "react";
import { NavBar } from "@/components/NavBar";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import Loader from "@/components/Util/Loader";
import UserConversations from "@/components/UserConversations";
import Suggestion from "@/components/Suggestion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Force mobile to start at the Feed (Index 1 if Suggestions were visible)
    // Since we want to block the first panel, we scroll to index 0 of the "allowed" area
    if (window.innerWidth < 768 && scrollContainerRef.current) {
      // We skip the first panel (Suggestion) by scrolling by one window width
      scrollContainerRef.current.scrollLeft = window.innerWidth;
    }
  }, []);

  if (loading || !isAuthenticated)
    return (
      <div className="HomeBg">
        <Loader />
      </div>
    );

  return (
    <div className="h-screen HomeBg flex flex-col overflow-hidden">
      <div className="sticky top-0 z-50 h-[75px] shrink-0">
        <NavBar />
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 flex overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide"
      >
        <div className="flex w-fit md:w-full min-h-full">
          {/* 1. SUGGESTIONS (Hidden on Mobile) 
              We use 'hidden md:block' so it doesn't exist in the mobile scroll snap chain.
          */}
          <aside className="hidden md:block md:w-[30%] lg:w-[25%] p-5 h-[calc(100vh-75px)] overflow-y-auto scrollbar-hide border-r border-white/5">
            <Suggestion />
          </aside>

          {/* 2. MAIN FEED (Middle Slide) */}
          <main className="w-screen md:w-[40%] lg:w-[50%] shrink-0 snap-center h-[calc(100vh-75px)] overflow-y-auto scrollbar-hide">
            <div className="md:hidden flex justify-end px-6 py-2 opacity-30 text-[9px] font-black uppercase tracking-widest">
              <span>Chats →</span>
            </div>
            <div className="max-w-[700px] mx-auto">{children}</div>
          </main>

          {/* 3. CONVERSATIONS (Right Slide) */}
          <aside className="w-screen md:w-[30%] lg:w-[25%] shrink-0 snap-center p-2 h-[calc(100vh-75px)] overflow-y-auto scrollbar-hide border-l border-white/5">
            <div className="md:hidden mb-4 opacity-40 text-[10px] font-black uppercase tracking-[0.3em] text-center">
              ← Swipe left for Feed
            </div>
            <UserConversations />
          </aside>
        </div>
      </div>
    </div>
  );
}
