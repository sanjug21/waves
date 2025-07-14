'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { loginUser } from '@/lib/firebase/auth';
import Loader from '@/components/Loader';

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoadingAuth = useAppSelector((state) => state.auth.loading);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors({});
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrors({});
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 

    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.password) passwordRef.current?.focus();
      return;
    }

    setIsLoggingIn(true);
    setErrors({});

    try {
      await loginUser(dispatch, email, password);

    } catch (err: any) {
      setErrors({ general: err.message || 'Login failed. Please check your credentials.' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const inputBaseClass =
    'w-full p-3 rounded-2xl bg-white bg-opacity-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out hover:border-blue-400 hover:border-opacity-70 shadow-inner';

  const baseLabelClass = 'block text-sm font-medium text-gray-200 mb-1 text-left';

  const isLoginButtonDisabled = password.length < 6 || isLoggingIn;

  if(isAuthenticated || isLoadingAuth) {
    return (
      <Loader/>
    );
  }

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
              className={`${inputBaseClass} ${errors.email ? 'border-2 border-red-600' : 'border border-blue-500 border-opacity-50'}`}
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              disabled={isLoggingIn}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1 text-left">{errors.email}</p>}
          </div>

          <div className="relative">
            <label htmlFor="password" className={baseLabelClass}>Password</label>
            <input
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className={`${inputBaseClass} pr-10 ${errors.password ? 'border-2 border-red-600' : 'border border-blue-500 border-opacity-50'}`}
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoggingIn}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-2/3 right-3 -translate-y-1/2 text-black rounded-full bg-transparent p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isLoggingIn}
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
            {errors.password && <p className="text-red-400 text-sm mt-1 text-left">{errors.password}</p>}
          </div>

          {errors.general && <p className="text-red-400 text-sm mt-2">{errors.general}</p>}

          <div className="relative w-full">
            <button
              type="submit" 
              disabled={isLoginButtonDisabled}
              title={isLoginButtonDisabled && !isLoggingIn ? 'Password must be at least 6 characters long.' : ''}
              className={`group relative mt-10 w-full border-2 text-lg font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-75
                ${isLoginButtonDisabled
                  ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                  : 'border-blue-400 text-blue-300 hover:border-blue-300 hover:text-white hover:bg-blue-600 focus:ring-blue-400'
                }`}
            >
              <span className="relative z-10">
                {isLoggingIn ? 'Logging in...' : 'Log In'}
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
