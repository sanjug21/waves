export default function ProfileSkelton(){
    return (
        <div className="bg-white shadow-xl rounded-b-xl overflow-hidden max-w-4xl mx-auto mt-2 mb-2 animate-pulse">
      <div className="flex flex-col sm:flex-row items-center sm:items-start p-6 sm:p-8 gap-6">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-300" />
        <div className="flex-1 space-y-4">
          <div className="h-6 w-2/3 bg-gray-300 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="flex gap-4 mt-6">
            <div className="h-10 w-24 bg-gray-300 rounded-full" />
            <div className="h-10 w-24 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
    );
}