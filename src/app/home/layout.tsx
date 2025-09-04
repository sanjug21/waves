"use client";

import React, { useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import Loader from "@/components/Util/Loader";
import UserConversations from "@/components/UserConversations";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) return <div className="lendingPage"><Loader /></div>;

  return (
    <div className="h-screen HomeBg flex flex-col  ">
      <div className="sticky top-0 z-50 bg-white shadow-md h-[75px]">
        <NavBar />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hidden-style ">
        <div className="flex  min-h-full">
          <div className="hidden lg:block sm:w-1/2 md:w-1/3 p-5">
            Suggestions
          </div>

          <main className="w-full sm:w-[60%] lg:w-[45%]  ">
            <div className="max-w-[1000px] mx-auto">{children}</div>
          </main>

          <div className="sticky right-0 top-0 max-h-[calc(100vh-75px)] overflow-y-auto hidden sm:block sm:w-2/5 lg:w-1/3 p-2 ">
            <UserConversations />
          </div>
        </div>
      </div>
    </div>
  );
}
