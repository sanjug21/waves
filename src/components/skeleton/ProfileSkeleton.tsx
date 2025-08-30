export default function ProfileSkelton() {
  return (
    <div className="min-h-screen w-full px-4 py-6 bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl max-w-3xl mx-auto animate-pulse">
        {/* Edit Icon Placeholder */}
        <div className="flex justify-end px-6 pt-4">
          <div className="h-5 w-5 bg-gray-300 rounded-md" />
        </div>

        {/* Profile Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start px-6 sm:px-8 pt-6 pb-8 gap-6">
          {/* Avatar */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-300 border-4 border-white shadow-md" />

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-4 w-full">
            <div className="h-8 bg-gray-300 rounded-md w-3/5 mx-auto sm:mx-0" />

            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded-md w-full mx-auto sm:mx-0" />
              <div className="h-4 bg-gray-300 rounded-md w-4/5 mx-auto sm:mx-0" />
            </div>

            <div className="flex justify-center sm:justify-start gap-4 pt-2">
              <div className="h-10 w-24 bg-gray-300 rounded-full" />
              <div className="h-10 w-24 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}