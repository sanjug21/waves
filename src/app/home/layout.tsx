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
    // Start mobile users at the "Feed" (the middle section)
    if (window.innerWidth < 768 && scrollContainerRef.current) {
      // We calculate the width of one section to center the feed
      const width = window.innerWidth;
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated)
    return (
      <div className="HomeBg">
        <Loader />
      </div>
    );

  return (
    <div className="h-screen HomeBg flex flex-col overflow-hidden">
      {/* NAVBAR */}
      <div className="sticky top-0 z-50 h-[75px] shrink-0">
        <NavBar />
      </div>

      {/* HORIZONTAL SLIDE CONTAINER 
          - snap-x snap-mandatory: Enables the "Slide to change" behavior
          - overflow-x-auto: Allows swiping on mobile
          - md:overflow-x-visible: Disables swiping on desktop to keep 3-column layout
      */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide"
      >
        <div className="flex w-full min-h-full">
          {/* 1. SUGGESTIONS (Left Slide) 
              - snap-center: Snaps here when swiped left
          */}
          <aside className="w-full shrink-0 snap-center md:snap-align-none md:w-[30%] lg:w-[25%] p-5 h-[calc(100vh-75px)] overflow-y-auto scrollbar-hide border-r border-white/5">
            <div className="md:hidden mb-4 opacity-40 text-[10px] font-black uppercase tracking-[0.3em] text-center">
              Swipe right for Feed →
            </div>
            <Suggestion />
          </aside>

          {/* 2. MAIN FEED (Middle Slide) */}
          <main className="w-full shrink-0 snap-center md:snap-align-none md:w-[40%] lg:w-[50%] h-[calc(100vh-75px)] overflow-y-auto scrollbar-hide">
            <div className="md:hidden flex justify-between px-6 py-2 opacity-30 text-[9px] font-black uppercase tracking-widest">
              <span>← Suggestions</span>
              <span>Chats →</span>
            </div>
            <div className="max-w-[700px] mx-auto">{children}</div>
          </main>

          {/* 3. CONVERSATIONS (Right Slide) */}
          <aside className="w-full shrink-0 snap-center md:snap-align-none md:w-[30%] lg:w-[25%] p-2 h-[calc(100vh-75px)] overflow-y-auto scrollbar-hide border-l border-white/5">
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
