"use client";

export default function ConversationCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-[1.8rem] border border-white/5 bg-white/[0.03] backdrop-blur-3xl animate-pulse">
      {/* Avatar Skeleton */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/5" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col justify-center flex-grow overflow-hidden space-y-3">
        <div className="flex justify-between items-center">
          {/* Name line */}
          <div className="h-4 w-1/3 bg-white/10 rounded-full" />
          {/* Timestamp line */}
          <div className="h-2 w-10 bg-white/5 rounded-full" />
        </div>

        {/* Message line */}
        <div className="h-3 w-3/4 bg-white/10 rounded-full" />
      </div>

      {/* Optional: Right side indicator skeleton */}
      <div className="ml-2 w-8 h-4 bg-white/5 rounded-lg" />
    </div>
  );
}
