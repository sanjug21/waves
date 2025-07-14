'use client';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { authListener } from '@/lib/firebase/auth';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoadingAuth = useAppSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    authListener(dispatch);
  }, [dispatch]);

  useEffect(() => {
   
    if (!isLoadingAuth) {
      if (isAuthenticated) {
        router.replace('/home');
      }
    }
  }, [isAuthenticated, isLoadingAuth, router]);

  return (
    <div>
      {children}
    </div>
  );
}
