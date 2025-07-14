'use client';
import React, { useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { authListener } from '@/lib/firebase/auth';
import Loader from '@/components/Loader';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const currentUser = useAppSelector((state: RootState) => state.auth.user);
  const isLoadingAuth = useAppSelector((state: RootState) => state.auth.loading);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    authListener(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoadingAuth, router]);

  if(isLoadingAuth || !isAuthenticated){
    return (
      <Loader/>
    )
  }
  return (
    <div className="min-h-screen lendingPage flex flex-col">
      <NavBar />
      <div className="pt-24"></div> 
      <div className="w-full md:w-8/17 p-5 bg-white rounded-lg ">
        {children}
      </div>
    </div>
  );
}
