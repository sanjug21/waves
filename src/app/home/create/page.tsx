'use client';
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from 'react-toastify';
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import API from "@/utils/api";

export default function CreatePost() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const userId=user?._id
  const divClick = () => {
      inputRef.current?.click();
  };

  const selectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };
  
  const removeImage = () => {
    setSelectedImage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const changeDescription = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const CreatePost = async () => {
     if (description.trim().length === 0 && !selectedImage) {
      toast.error('Description or an image is required to create a post.');
      return;
    }

    setLoading(true)
    const formData = new FormData();
    formData.append('description', description);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
     if (userId) {
      formData.append('userId', userId); 
    }
    try {

      const response=await API.post('/posts/create',formData);
      toast.success("Post created successfully!");
      setDescription("");
      setSelectedImage(null);

    }
    catch(error :any){
       const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || 'Failed to create post.' 
        : 'An unexpected error occurred.';
      toast.error(errorMessage);


    }finally{
     
      setLoading(false)
    }
 
  };

  const disablePostButton = description.trim().length === 0 && !selectedImage;

  const userDp = user?.dp || '/def.png';
  const userName = user?.name ;

  return (
    <div className="w-full h-full  flex justify-center items-start overflow-y-auto relative p-4 ">
      {loading && (
        <div className="fixed inset-0 w-full h-full bg-gray-500/50 backdrop-blur-[2px] flex justify-center items-center z-50">
          <div className="loader"></div>
        </div>
      )}
      <div className="w-full max-w-full bg-white rounded-xl shadow-lg">
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <img
            src={userDp}
            alt="User DP"
            className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <h2 className="text-xl font-semibold">{userName}</h2>
        </div>
        <div className="p-4">
          <textarea
            className="w-full h-32 sm:h-48 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y text-gray-700 placeholder-gray-400 transition-all duration-300"
            placeholder="What's on your mind?"
            value={description}
            onChange={changeDescription}
          ></textarea>
        </div>
        <div className="p-4 border-t">
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            className="hidden"
            onChange={selectImage}
          />
          {!selectedImage ? (
            <div
              className="w-full h-64 flex items-center justify-center p-6 text-center border-2 border-dashed border-indigo-400 rounded-md text-indigo-600 cursor-pointer hover:bg-indigo-50 transition-colors"
              onClick={divClick}
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
                onClick={removeImage}
              >
                Remove Image
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row-reverse items-center justify-start gap-3 p-4 border-t">
          <button
            className={`w-full sm:w-auto px-6 py-2 rounded-md transition-all duration-200 ${
              disablePostButton
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
            disabled={disablePostButton || loading}
            onClick={CreatePost}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
          <button
            onClick={() => {
              router.back();
            }}
            className="w-full sm:w-auto px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
