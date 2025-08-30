'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Util/Loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '@/store/hooks';
import { z, ZodError } from 'zod';
import { SignupSchema, passwordSchema } from '@/lib/schema/user.schema';
import API from '@/utils/api';
import axios from 'axios';
import { set } from 'mongoose';

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function SignUp() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSigningUp, setIsSigningUp] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);

  if (loading || isAuthenticated) {
    return <Loader />;
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSigningUp(true);

    try {
      const fullSchema = SignupSchema.extend({
        confirmPassword: z.string().min(1, 'Confirm Password is required.'),
      }).refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
      });

      fullSchema.parse({ name, email, password, confirmPassword });

      await API.post('/auth/signup', { name, email, password });
      
      toast.success('Account created successfully! Redirecting to login...');
      router.push('/auth/login');
    } catch (err: any) {
      if (err instanceof ZodError) {
        const newErrors: FormErrors = {};
        err.issues.forEach(issue => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as keyof FormErrors] = issue.message;
          }
        });
        setErrors(newErrors);
      } else if (axios.isAxiosError(err)) {
        const apiError = err.response?.data?.message || 'Sign Up failed. Please try again.';
        setErrors({ general: apiError });
        toast.error(apiError);
      } else {
        const genericError = err.message || 'An unexpected error occurred.';
        setErrors({ general: genericError });
        toast.error(genericError);
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  const baseInputClass =
    'w-full border border-blue-500 border-opacity-50 p-3 rounded-2xl bg-white bg-opacity-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out hover:border-blue-400 hover:border-opacity-70 shadow-inner';

  const baseLabelClass = 'block text-sm font-medium text-gray-200 mb-1 text-left';

  return (
    <div className="min-h-screen bg-cover bg-center lendingPage flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      <div className="relative bg-opacity-15 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-700 border-opacity-30 p-8 max-w-md w-full text-center transform transition-all duration-500 ease-out animate-fade-in flex flex-col items-center justify-center ">
        <h1 className="relative z-10 text-white text-4xl sm:text-5xl font-semibold mb-8 leading-tight drop-shadow-md text-center">
          Join <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Waves</span>
        </h1>
        <form onSubmit={handleSignUp} className="space-y-4 w-full" noValidate>
          <div>
            <label htmlFor="name" className={baseLabelClass}>Name</label>
            <input
              ref={nameRef}
              type="text"
              id="name"
              className={`${baseInputClass} ${errors.name ? 'border-2 border-red-600' : ''}`}
              placeholder="Enter your name"
              aria-label="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({});
              }}
              disabled={isSigningUp}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1 text-left">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className={baseLabelClass}>Email</label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              className={`${baseInputClass} ${errors.email ? 'border-2 border-red-600' : ''}`}
              placeholder="Enter your email"
              aria-label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({});
              }}
              disabled={isSigningUp}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1 text-left">{errors.email}</p>}
          </div>

          <div className="relative">
            <label htmlFor="password" className={baseLabelClass}>Password</label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              className={`${baseInputClass} ${errors.password ? 'border-2 border-red-600' : ''}`}
              placeholder="Enter your password"
              aria-label="Password"
              value={password}
              onChange={(e)=>{
                setPassword(e.target.value);
                setErrors({});
              }}
              disabled={isSigningUp}
            />
            {errors.password && <p className="text-red-400 text-sm mt-1 text-left">{errors.password}</p>}
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className={baseLabelClass}>Confirm Password</label>
            <input
              ref={confirmPasswordRef}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className={`${baseInputClass} pr-10 ${errors.confirmPassword ? 'border-2 border-red-600' : ''}`}
              placeholder="Confirm your password"
              aria-label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({});
              }}
              disabled={isSigningUp}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={toggleConfirmPasswordVisibility}
              className="absolute top-2/3 right-3 -translate-y-1/2 flex items-center text-black focus:outline-none rounded-full bg-transparent p-1"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              disabled={isSigningUp}
            >
              {showConfirmPassword ? <FiEye className="h-5 w-5" /> : <FiEyeOff className="h-5 w-5" />}
            </button>
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1 text-left">{errors.confirmPassword}</p>}
          </div>

          
          <button
            type="submit"
            disabled={isSigningUp}
            className={`group relative block mt-10 w-full border-2 py-3 px-8 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-75
              ${isSigningUp
                ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                : 'border-blue-400 text-blue-300 hover:border-blue-300 hover:text-white hover:bg-blue-600 focus:ring-blue-400'
              }`}
            aria-label="Create Account"
          >
            <span className="relative z-10">
              {isSigningUp ? 'Creating Account...' : 'Create Account'}
            </span>
            <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          </button>
        </form>

        <p className="mt-6 text-center text-gray-200">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium transition duration-150 ease-in-out">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
