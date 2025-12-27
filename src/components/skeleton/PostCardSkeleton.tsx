"use client";

export default function PostCardSkeleton() {
  return (
    <div className="group relative w-full bg-white/[0.08] backdrop-blur-3xl border border-white/20 rounded-[2.5rem] overflow-hidden animate-pulse shadow-2xl mb-8">
      {/* HEADER: Matching the User Pill design */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
          {/* Avatar Circle */}
          <div className="h-11 w-11 rounded-full bg-white/10 border-2 border-white/10" />

          {/* Header Pill Skeleton */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-8 w-44">
            <div className="ml-4 h-3 w-16 bg-white/10 rounded-full" />{" "}
            {/* Name */}
            <div className="mx-3 h-3 w-[1px] bg-white/10" /> {/* Divider */}
            <div className="h-2 w-10 bg-white/5 rounded-full" /> {/* Date */}
          </div>
        </div>
        {/* More icon skeleton */}
        <div className="h-5 w-5 bg-white/10 rounded-full mr-2" />
      </div>

      {/* DESCRIPTION: Matching the high-contrast text area */}
      <div className="px-8 py-6 space-y-3">
        <div className="h-4 w-full bg-white/10 rounded-full" />
        <div className="h-4 w-5/6 bg-white/10 rounded-full opacity-70" />
        <div className="h-4 w-2/3 bg-white/10 rounded-full opacity-40" />
      </div>

      {/* IMAGE: Matching the rounded-[2.2rem] image container */}
      <div className="px-4 pb-4">
        <div className="h-[450px] w-full bg-white/[0.05] rounded-[2.2rem] border border-white/10 shadow-inner" />
      </div>

      {/* FOOTER: Matching the Like & Comment Pills */}
      <div className="px-6 py-5 flex items-center justify-between border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-4">
          {/* Like Pill Skeleton */}
          <div className="flex items-center bg-white/10 border border-white/10 rounded-full h-10 w-24">
            <div className="ml-4 h-5 w-5 bg-white/10 rounded-full" />{" "}
            {/* Icon */}
            <div className="mx-3 h-4 w-[1px] bg-white/10" /> {/* Divider */}
            <div className="h-3 w-6 bg-white/10 rounded-full" /> {/* Count */}
          </div>

          {/* Comment Pill Skeleton */}
          <div className="flex items-center bg-white/10 border border-white/10 rounded-full h-10 w-28">
            <div className="ml-4 h-5 w-5 bg-white/10 rounded-full" />{" "}
            {/* Icon */}
            <div className="mx-3 h-4 w-[1px] bg-white/10" /> {/* Divider */}
            <div className="h-3 w-8 bg-white/10 rounded-full" /> {/* Count */}
          </div>
        </div>

        {/* Share Button Skeleton */}
        <div className="h-10 w-10 bg-white/10 border border-white/10 rounded-full" />
      </div>
    </div>
  );
}
