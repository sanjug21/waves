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
     
      <div className='flex flex-1 overflow-hidden space-x-3  p-4 pb-0 sm:hidd'>
        <div className='hidden lg:block sm:w-1/2 md:w-1/3  p-5 overflow-auto'>
        chat list
        </div>
        <div className="w-full lg:w-2/3  rounded-lg overflow-auto scrollbar-hidden-style  backdrop-blur-md border ">
        {children}
      </div>
      <div className='hidden lg:block sm:w-1/2 md:w-1/3   p-5 overflow-auto'>
        Suggestions
      </div>
      </div>
      
      <Link href="/home/create" 
       className="fixed bottom-3 right-3 h-12 w-12 rounded-full bg-gradient-to-tr from-orange-500  to-orange-900 flex items-center justify-center text-white shadow-lg">
        <IoMdAdd />
    </Link>
    </div>
  );
}
