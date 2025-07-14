"use client";

import Loader from "@/components/Loader";
import { authListener, logoutUser } from "@/lib/firebase/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi"; 

export default function Home() {
  const [showOptions, setShowOptions] = useState(false);

  const user=useAppSelector((state)=>state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoadingAuth = useAppSelector((state) => state.auth.loading);
  useEffect(() => {
  
    const unsubscribe = authListener(dispatch);
    if(isAuthenticated) {
      router.replace('/home');
    }
        return () => unsubscribe();
  }, [isAuthenticated, dispatch, router]);

  const toggle = () => {
    setShowOptions(!showOptions);
  };

  if( isLoadingAuth) {
    return (
      <Loader/>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center lendingPage flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      <h1 className="relative z-10 text-white text-4xl sm:text-5xl font-semibold mb-8 leading-tight drop-shadow-md text-center">
        Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Waves</span>
      </h1>

      <div className="relative bg-opacity-15 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-950 border-opacity-30 p-8 max-w-sm w-full text-center transform transition-all duration-500 ease-out animate-fade-in flex flex-col items-center justify-center">
        {showOptions ? (
          <div className="relative z-10 flex flex-col gap-6 text-center w-full opacity-100 animate-fade-in-up">
            <button
              onClick={toggle}
              className="mb-4 p-2  rounded-full text-gray-400 hover:text-white  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 mx-auto"
              aria-label="Go back"
            >
              <FiArrowLeft className="h-8 w-8" />
            </button>

            <Link href="/auth/signup" className="group relative block w-full border-2 border-blue-400 text-blue-300 py-3 px-8 rounded-full text-lg font-semibold hover:border-blue-300 hover:text-white hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 overflow-hidden">
              <span className="relative z-10">New to Waves</span>
              <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </Link>
            <Link href="/auth/login" className="group relative block w-full border-2 border-blue-400 text-blue-300 py-3 px-8 rounded-full text-lg font-semibold hover:border-blue-300 hover:text-white hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 overflow-hidden">
              <span className="relative z-10">Already in Waves</span>
              <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </Link>
          </div>
        ) : (
          <p
            className="relative z-10 text-gray-200 text-lg sm:text-xl drop-shadow-sm cursor-pointer hover:text-blue-300 transition-colors duration-300 animate-pulse-fade-in font-medium px-4 py-2"
            onClick={toggle}
          >
            Dive into a seamless experience.
          </p>
        )}
      </div>
    </div>
  );
}