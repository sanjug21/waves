'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { registerUser } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FormErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSigningUp, setIsSigningUp] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoadingAuth = useAppSelector((state) => state.auth.loading);
  const router = useRouter();

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setErrors({});
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors({});
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrors({});
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setErrors({});
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    }

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

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm Password is required.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.username) usernameRef.current?.focus();
      else if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.password) passwordRef.current?.focus();
      else if (newErrors.confirmPassword) confirmPasswordRef.current?.focus();
      return;
    }

    setIsSigningUp(true);
    setErrors({});

    try {
      await registerUser(dispatch, email, password, username);
      toast.success('Account created successfully! Redirecting...');
    } catch (err: any) {
      toast.error(err.message || 'Sign Up failed. Please try again.');
    } finally {
      setIsSigningUp(false);
    }
  };

  const baseInputClass =
    'w-full border border-blue-500 border-opacity-50 p-3 rounded-2xl bg-white bg-opacity-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out hover:border-blue-400 hover:border-opacity-70 shadow-inner';

  const baseLabelClass = 'block text-sm font-medium text-gray-200 mb-1 text-left';

  const isSignUpButtonDisabled = isSigningUp || !username.trim() || !email.trim() || password.length < 6 || password !== confirmPassword;

  const getDisabledReason = () => {
    if (isSigningUp) return 'Signing up...';
    if (!username.trim()) return 'Username is required.';
    if (!email.trim()) return 'Email is required.';
    if (!validateEmail(email)) return 'Invalid email format.';
    if (!password.trim()) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (!confirmPassword.trim()) return 'Confirm Password is required.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return '';
  };

  if(isAuthenticated || isLoadingAuth) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-cover bg-center lendingPage flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="relative bg-opacity-15 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-700 border-opacity-30 p-8 max-w-md w-full text-center transform transition-all duration-500 ease-out animate-fade-in flex flex-col items-center justify-center ">
        <h1 className="relative z-10 text-white text-4xl sm:text-5xl font-semibold mb-8 leading-tight drop-shadow-md text-center">
          Join <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Waves</span>
        </h1>
        <form onSubmit={handleSignUp} className="space-y-4 w-full" noValidate>
          <div>
            <label htmlFor="username" className={baseLabelClass}>Username</label>
            <input
              ref={usernameRef}
              type="text"
              id="username"
              className={`${baseInputClass} ${errors.username ? 'border-2 border-red-600' : ''}`}
              placeholder="Enter your username"
              aria-label="Username"
              value={username}
              onChange={handleUsernameChange}
              disabled={isSigningUp}
            />
            {errors.username && <p className="text-red-400 text-sm mt-1 text-left">{errors.username}</p>}
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
              onChange={handleEmailChange}
              disabled={isSigningUp}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1 text-left">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className={baseLabelClass}>Password</label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              className={`${baseInputClass} ${errors.password ? 'border-2 border-red-600' : ''}`}
              placeholder="Enter your password"
              aria-label="Password"
              value={password}
              onChange={handlePasswordChange}
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
              onChange={handleConfirmPasswordChange}
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
            disabled={isSignUpButtonDisabled}
            title={isSignUpButtonDisabled ? getDisabledReason() : ''}
            className={`group relative block mt-10 w-full border-2 py-3 px-8 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-75
              ${isSignUpButtonDisabled
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