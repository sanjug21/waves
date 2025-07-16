'use client';
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function CreatePost() {
  const user = useAppSelector((state) => state.auth.user);
  const def = '/def.png';
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  
  const handleDivClick = () => {
    inputRef.current?.click();
  };
  

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };
  
  const handleRemoveImage = () => {
      setSelectedImage(null);
      if(inputRef.current) {
          inputRef.current.value = "";
      }
  }

  return (
    <div className="w-full h-full bg-gray-50  flex justify-center items-start overflow-y-auto">
      <div className="w-full max-w-full bg-white rounded-lg shadow-lg">
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <img
            src={user?.dp ? user.dp : def}
            alt="User DP"
            className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <h2 className="text-xl font-semibold">{user?.name}</h2>
        </div>

        <div className="p-4">
          <textarea
            className="w-full h-32 sm:h-48 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y text-gray-700 placeholder-gray-400 transition-all duration-300"
            placeholder="What's on your mind?"
          ></textarea>
        </div>

        <div className="p-4 border-t">
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            className="hidden"
            onChange={handleImageSelect}
          />

          {!selectedImage ? (
            <div 
              className="w-full h-64 flex items-center justify-center p-6 text-center border-2 border-dashed border-indigo-400 rounded-md text-indigo-600 cursor-pointer hover:bg-indigo-50 transition-colors"
              onClick={handleDivClick}
            >
              Click to add image
            </div>
          ) : (
            <div className="mt-4 space-y-3 ">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="w-full max-h-[50vh] object-contain rounded-md border border-gray-300 bg-gray-500 shadow-sm"
              />

                <button 
                  className="px-4 py-2 w-full text-red-600 border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </button>
             
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row-reverse items-center justify-start gap-3 p-4 border-t">
          <button className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
            Post
          </button>
          <button onClick={() => { 
            router.back();
          }} className="w-full sm:w-auto px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}