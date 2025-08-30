'use client';
import React, { useEffect } from 'react';
import { useAppDispatch,useAppSelector } from '@/store/hooks';
import { setAuthenticated, setLoggedOut, setLoading } from '@/store/slices/authSlice';
import { UserDetails } from '@/types/types';
import Loader from '../Util/Loader';

export function AuthStatusLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        console.log(data)
        
        if (data.isAuthenticated && data.userDetails) {
          dispatch(setAuthenticated(data.userDetails as UserDetails));
        } else {
          dispatch(setLoggedOut());
        }
      } catch (error) {
        console.error("Failed to fetch auth status:", error);
        dispatch(setLoggedOut());
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    checkAuthStatus();
  }, [dispatch]);

  //  if (loading) {
  //   return <Loader/>;
  // }


  return <>{children}</>;
}
