'use client';

export default function UserCardSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border border-gray-100 bg-white animate-pulse rounded-lg shadow-md z-[1]">
      
      <div className="w-12 h-12 rounded-full bg-gray-300" />

      
      <div className="flex-1 min-w-0 space-y-1">
        <div className="h-4 w-1/2 bg-gray-300 rounded" />
        <div className="h-3 w-2/3 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
