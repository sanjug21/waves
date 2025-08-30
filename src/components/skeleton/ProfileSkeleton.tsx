'use client';

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen w-full px-4 py-6 bg-gray-50">
      <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-white animate-pulse">
        {/* Settings Icon Placeholder */}
        <div className="absolute top-4 right-4 z-10 h-5 w-5 bg-gray-300 rounded-md" />

        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-blue-50 to-purple-100 p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[rgb(0,12,60)] to-purple-700 opacity-10 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-300 border-2 border-white shadow-lg" />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-2 bg-gradient-to-r from-blue-400 to-purple-500 blur-sm opacity-30" />
            </div>

            {/* Profile Info Skeleton */}
            <div className="flex-1 text-center sm:text-left space-y-4 w-full">
              <div className="h-8 bg-gray-300 rounded-md w-3/5 mx-auto sm:mx-0" />
              <div className="h-4 bg-gray-300 rounded-md w-full mx-auto sm:mx-0" />
              <div className="h-4 bg-gray-300 rounded-md w-4/5 mx-auto sm:mx-0" />

              <div className="flex justify-center sm:justify-start gap-4 pt-2">
                <div className="h-10 w-24 bg-gray-300 rounded-full" />
                <div className="h-10 w-24 bg-gray-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
