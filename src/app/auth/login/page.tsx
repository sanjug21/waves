'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAuthenticated, setLoading, setError, clearError, setLoggedOut } from '@/store/slices/authSlice';
import API from '@/utils/api';
import { LoginSchema } from '@/lib/schema/user.schema';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ZodError } from 'zod';
import axios from 'axios';
import Loader from '@/components/Loader';

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
 
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated,router]);
  // if(isAuthenticated && loading){
  //   return <Loader/>;
  // }
if(loading || isAuthenticated){
  return <Loader/>;

}

 
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
     dispatch(setLoading(true));

    try {
      LoginSchema.parse({ email, password });
      const response = await API.post('/auth/login', { email, password });
      dispatch(setAuthenticated(response.data.userDetails));
      
      
    } catch (err: any) {
      let errorMessage = 'Login failed. Please try again later.';

      if (err instanceof ZodError) {
        errorMessage = err.issues[0]?.message || 'Invalid input.';
        toast.error(errorMessage);
        dispatch(setError(errorMessage));
      } else if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          toast.error('Invalid credentials');
          errorMessage = 'Invalid credentials';
        } else {
          errorMessage = err.response?.data?.message || 'Login failed. Please try again later.';
          toast.error(errorMessage);
        }
        dispatch(setError(errorMessage));
      } else {
        toast.error(errorMessage);
        dispatch(setError(errorMessage));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const inputBaseClass = 'w-full p-3 rounded-2xl bg-white bg-opacity-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out hover:border-blue-400 hover:border-opacity-70 shadow-inner';
  const baseLabelClass = 'block text-sm font-medium text-gray-200 mb-1 text-left';
  const isLoginButtonDisabled = loading || password.length < 8;

  return (
    <div className="min-h-screen bg-cover bg-center lendingPage flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      <div className="relative bg-opacity-15 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-700 border-opacity-30 p-8 max-w-md w-full text-center animate-fade-in flex flex-col items-center justify-center">
        <h1 className="text-white text-4xl sm:text-5xl font-semibold mb-8 drop-shadow-md">
          Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Waves</span>
        </h1>

        <form onSubmit={handleLogin} className="space-y-4 w-full">
          <div>
            <label htmlFor="email" className={baseLabelClass}>Email</label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              className={`${inputBaseClass} border border-blue-500 border-opacity-50`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                dispatch(clearError());
              }}
              disabled={loading}
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className={baseLabelClass}>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className={`${inputBaseClass} pr-10 border border-blue-500 border-opacity-50`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-2/3 right-3 -translate-y-1/2 text-black rounded-full bg-transparent p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={loading}
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm mt-1 text-center">{error}</p>}
          
          <div className="relative w-full">
            <button
              type="submit"
              disabled={isLoginButtonDisabled}
              className={`group relative mt-10 w-full border-2 text-lg font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-75
                ${isLoginButtonDisabled
                  ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                  : 'border-blue-400 text-blue-300 hover:border-blue-300 hover:text-white hover:bg-blue-600 focus:ring-blue-400'
                }`}
            >
              <span className="relative z-10">
                {loading ? 'Logging in...' : 'Log In'}
              </span>
              <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </button>
          </div>

          <p className="mt-6 text-gray-200">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium transition duration-150">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
