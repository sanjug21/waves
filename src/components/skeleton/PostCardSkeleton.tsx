'use client';

export default function PostCardSkeleton() {
  return (
    <div className="bg-blue-200 p-6 rounded-3xl shadow-lg font-sans animate-pulse">
      <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-md p-6 w-full mx-auto">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-300 mr-4" />
          <div className="flex-grow">
            <div className="h-4 w-1/2 bg-gray-300 rounded mb-1" />
            <div className="h-3 w-1/4 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="mb-4 space-y-2">
          <div className="h-4 w-full bg-gray-300 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>

        <div className="mb-4 h-80 w-full bg-gray-300 rounded-xl border border-gray-100" />

        <div className="flex items-center space-x-6 border-t border-gray-200 pt-4">
          <div className="h-5 w-24 bg-gray-300 rounded-full" />
          <div className="h-5 w-28 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
