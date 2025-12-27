"use client";

export default function UserCardSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] animate-pulse shadow-xl shadow-black/20">
      {/* Avatar Circle Skeleton */}
      <div className="shrink-0">
        <div className="w-13 h-13 rounded-full bg-white/10 border-2 border-white/5" />
      </div>

      {/* User Info Skeleton */}
      <div className="flex-1 min-w-0 space-y-2.5">
        {/* Name Bar */}
        <div className="h-4 w-1/3 bg-white/15 rounded-full" />
        {/* Email Bar */}
        <div className="h-3 w-1/2 bg-white/10 rounded-full" />
      </div>

      {/* Action Button Skeleton */}
      <div className="ml-2 h-8 w-16 bg-white/5 rounded-full border border-white/5" />
    </div>
  );
}
