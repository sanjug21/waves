'use client';
import React, { useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { IoMdAdd } from "react-icons/io";
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  
  
  return (
    <div className="h-screen lendingPage flex flex-col ">
     
       <NavBar />
     
      <div className='flex flex-1 overflow-hidden  bg-gradient-to-br from-blue-50 to-blue-100 transition-all duration-300 ease-in-out'>
        <div className='hidden lg:block sm:w-1/2 md:w-1/3  p-5 overflow-auto'>
        Suggestions
        </div>
        <div className="w-full  lg:w-2/3  scrollbar-hidden-style   border-2 border-[rgb(0,12,60)] transition-all duration-300 ease-in-out">
        {children}
      </div>
      <div className='hidden sm:block sm:w-2/5  lg:w-1/3   p-5 overflow-auto transition-all duration-300 ease-in-out'>
        chat list
      </div>
      </div>
      
      {/* <Link href="/home/create" 
       className="fixed bottom-3 right-3 h-12 w-12 rounded-full bg-gradient-to-tr from-orange-500  to-orange-900 flex items-center justify-center text-white shadow-lg">
        <IoMdAdd />
    </Link> */}
    </div>
  );
}
