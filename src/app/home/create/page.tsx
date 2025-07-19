'use client';
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { createPost } from "@/lib/firebase/posts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreatePost() {
  const user = useAppSelector((state) => state.auth.user);
  const def = '/def.png';
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState<string>('');
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
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const uploadPost = async () => {
    if (!user?.uid) {
      toast.error("You need to be logged in to create a wave.");
      return;
    }

    if (!description.trim() && !selectedImage) {
      toast.error("Your wave needs a description or an image.");
      return;
    }

    setLoading(true);
    try {
      const posted = await createPost(
        user.uid,
        user.name || '',
        user.dp || '',
        description || '',
        selectedImage
      );

      if (posted) {
        toast.success("Wave created successfully!");
        setDescription('');
        setSelectedImage(null);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
       
      } else {
        toast.error("Failed to create wave. Please try again.");
        console.error("Post creation failed, but no error was thrown by the service.");
      }
    } catch (err: any) {
      console.error('Error uploading post:', err);
      toast.error(`Failed to create wave: ${err.message || "An unknown error occurred."}`);
    } finally {
      setLoading(false);
    }
  };

  const changeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const disablePostButton = description.trim().length === 0 && !selectedImage;

  return (
    <div className="w-full h-full bg-gray-50 flex justify-center items-start overflow-y-auto relative">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {loading && (
        <div className="fixed inset-0 w-full h-full bg-gray-500/50 backdrop-blur-[2px] flex justify-center items-center z-50">
          <div className="loader"></div>
        </div>
      )}

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
          <button
            className={`w-full sm:w-auto px-6 py-2 rounded-md transition-all duration-200 ${
              disablePostButton
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
            disabled={disablePostButton || loading}
            onClick={uploadPost}
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