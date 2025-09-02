"use client";

export default function ChatPageSkeleton() {
  return (
    <div className="bg-black/20 backdrop-blur-sm h-[calc(100vh-75px)] flex flex-col text-white">
      <div className="flex items-center space-x-4 bg-gray-900/60 p-3 shadow-md border-b border-gray-700 animate-pulse">
        <div className="h-12 w-12 rounded-full bg-gray-700" />
        <div className="h-6 w-40 bg-gray-700 rounded-md" />
      </div>
      <div className="flex-1" />
      <div className="p-4 border-t border-gray-700">
        <div className="h-12 w-full bg-gray-800/80 rounded-lg" />
      </div>
    </div>
  );
}
