"use client";

export default function ProfileSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="relative max-w-4xl mx-auto overflow-hidden bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-none shadow-2xl">
        {/* Settings Icon Placeholder */}
        <div className="absolute top-6 right-6 z-10 h-9 w-9 bg-white/10 rounded-full border border-white/5" />

        {/* Main Content Area */}
        <div className="relative p-8 sm:p-12">
          {/* Subtle Background Glow behind the Avatar */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 blur-[100px] -z-10 rounded-full" />

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8 relative z-10">
            {/* Avatar Circle Skeleton */}
            <div className="shrink-0">
              <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-white/10 border-4 border-white/5 shadow-2xl" />
            </div>

            {/* User Info Skeleton */}
            <div className="flex-1 text-center sm:text-left space-y-6 w-full">
              {/* Name & Email Pill placeholders */}
              <div className="space-y-3">
                <div className="h-10 bg-white/15 rounded-full w-3/5 mx-auto sm:mx-0" />{" "}
                {/* Name */}
                <div className="h-4 bg-blue-400/20 rounded-full w-1/4 mx-auto sm:mx-0" />{" "}
                {/* Email handle */}
              </div>

              {/* Bio Lines */}
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded-full w-full" />
                <div className="h-3 bg-white/10 rounded-full w-4/5" />
              </div>

              {/* Action Buttons Placeholders */}
              <div className="flex justify-center sm:justify-start gap-3 pt-2">
                <div className="h-11 w-32 bg-white/10 rounded-full" />{" "}
                {/* Follow Button */}
                <div className="h-11 w-32 bg-white/10 rounded-full" />{" "}
                {/* Message Button */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
