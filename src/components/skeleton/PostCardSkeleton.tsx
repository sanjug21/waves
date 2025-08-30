'use client';

export default function PostCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 max-w-[750px] mx-auto font-sans animate-pulse">
      {/* Header: Avatar + Name + Date */}
      <div className="flex items-center gap-4 mb-4">
        <div className="h-10 w-10 rounded-full bg-gray-300 border border-gray-300" />
        <div className="flex flex-col flex-grow space-y-1">
          <div className="h-4 w-1/3 bg-gray-300 rounded" />
          <div className="h-3 w-1/4 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 space-y-2">
        <div className="h-4 w-full bg-gray-300 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>

      {/* Image Preview */}
      <div className="mb-4 h-[450px] w-full bg-gray-300 rounded-xl border border-gray-100" />

      {/* Footer: Likes & Comments split equally */}
      <div className="flex border-t border-gray-100 pt-3">
        <div className="w-1/2 flex justify-center">
          <div className="h-5 w-20 bg-gray-300 rounded-full" />
        </div>
        <div className="w-1/2 flex justify-center">
          <div className="h-5 w-24 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
