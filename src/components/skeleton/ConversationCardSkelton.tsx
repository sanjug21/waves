"use client";

export default function ConversationCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-800 bg-black/40">
      <div className="w-11 h-11 rounded-full bg-gray-800 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 bg-gray-800 rounded animate-pulse" />
        <div className="h-3 w-3/4 bg-gray-800 rounded animate-pulse" />
      </div>
    </div>
  );
}
