'use client';

import React, { useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import Loader from '@/components/Loader';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  if (loading) return <Loader />;
  if (!isAuthenticated) {
    router.replace('/auth/login');
    return null;
  }

  return (
    <div className="h-screen lendingPage flex flex-col">
      {/* Fixed Sticky NavBar */}
      <div className="sticky top-0 z-50 bg-white shadow-md h-[75px]">
        <NavBar />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden-style">
        <div className="flex bg-gradient-to-br from-blue-50 to-blue-100 min-h-full">
          {/* Suggestions Panel */}
          <div className="hidden lg:block sm:w-1/2 md:w-1/3 p-5">
            Suggestions
          </div>

          {/* Main Content */}
          <main className="w-full sm:w-[60%] lg:w-[45%] border-l-2 border-r-2 border-[rgb(0,12,60)] ">
            <div className="max-w-[1000px] mx-auto">{children}</div>
          </main>

          {/* Chat List Panel */}
          <div className="hidden sm:block sm:w-2/5 lg:w-1/3 p-5">
            chat list
          </div>
        </div>
      </div>
    </div>
  );
}
