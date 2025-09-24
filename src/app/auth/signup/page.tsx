'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Util/Loader';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/store/hooks';
import { z, ZodError } from 'zod';
import { SignupSchema } from '@/lib/schema/user.schema';
import API from '@/utils/api';
import axios from 'axios';

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
  general?: string;
};

export default function SignUp() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  const [step, setStep] = useState<"email" | "otp" | "details">("email");
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace("/home");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!canResend && resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [canResend, resendTimer]);

  const sendOtp = async () => {
    setErrors({});
    setIsSendingOtp(true);
    try {
      await API.post("/auth/sendOTP", { email, purpose: "signup" });
      toast.success("OTP sent to your email");
      setStep("otp");
      setCanResend(false);
      setResendTimer(60);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to send OTP";
      setErrors({ email: msg });
      toast.error(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    setErrors({});
    setIsVerifyingOtp(true);
    try {
      await API.post("/auth/verifyOTP", { email, otp });
      toast.success("Email verified");
      setStep("details");
    } catch (err: any) {
      const msg = err.response?.data?.message || "OTP verification failed";
      setErrors({ otp: msg });
      toast.error(msg);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const fullSchema = SignupSchema.extend({
        confirmPassword: z.string().min(1, "Confirm Password is required."),
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });

      fullSchema.parse({ name, email, password, confirmPassword });

      await API.post("/auth/signup", { name, email, password });
      toast.success("Account created successfully! Redirecting to login...");
      router.push("/auth/login");
    } catch (err: any) {
      if (err instanceof ZodError) {
        const newErrors: FormErrors = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as keyof FormErrors] = issue.message;
          }
        });
        setErrors(newErrors);
      } else if (axios.isAxiosError(err)) {
        const apiError =
          err.response?.data?.message || "Sign Up failed. Please try again.";
        setErrors({ general: apiError });
        toast.error(apiError);
      } else {
        const genericError = err.message || "An unexpected error occurred.";
        setErrors({ general: genericError });
        toast.error(genericError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const baseInputClass =
    "w-full border border-blue-500 border-opacity-50 p-3 rounded-2xl bg-white bg-opacity-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out hover:border-blue-400 hover:border-opacity-70 shadow-inner";

  const baseLabelClass =
    "block text-sm font-medium text-gray-200 mb-1 text-left";

  if (loading || isAuthenticated) return <Loader />;

  return (
    <div className="min-h-screen bg-cover bg-center lendingPage flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      <div className="relative bg-opacity-15 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-700 border-opacity-30 p-8 max-w-md w-full text-center transform transition-all duration-500 ease-out animate-fade-in flex flex-col items-center justify-center bg-black/40">
        <h1 className="text-white text-4xl font-semibold mb-8">
          Join{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Waves
          </span>
        </h1>

        {step === "email" && (
          <>
            <input
              type="email"
              id="email"
              className={`${baseInputClass} ${
                errors.email ? "border-2 border-red-600" : ""
              }`}
              placeholder="Enter email to continue..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1 text-left">
                {errors.email}
              </p>
            )}
            <button
              onClick={sendOtp}
              disabled={isLoading || !email}
              className="btn mt-6 w-1/2 rounded-2xl bg-gradient-to-br from-orange-600 to-purple-700 text-white font-semibold py-2 px-4 transition duration-300 ease-in-out hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
           <div className='mb-2 text-green-400'>OTP sent successfully!!</div>
            <div className="w-full mb-6">
              <input
                type="email"
                id="email"
                className={`${baseInputClass} pr-10 opacity-70 cursor-not-allowed border-2 border-green-500`}
                value={email}
                disabled
              />
              
            </div>

            
            <div className="flex gap-2 justify-center mb-2">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  disabled={isLoading}
                  className="w-10 h-10 text-center text-xl font-semibold border border-black rounded focus:outline-none bg-white bg-opacity-10 text-gray-800"
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-red-400 text-sm mt-1 text-left">
                {errors.otp}
              </p>
            )}

            <button
              onClick={() => verifyOtp(otpDigits.join(""))}
              disabled={isVerifyingOtp || otpDigits.some((d) => d === "")}
              className="btn mt-4 w-1/2 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 text-white font-semibold py-2 px-4 transition duration-300 ease-in-out hover:opacity-90 disabled:opacity-50"
            >
              {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={sendOtp}
              disabled={!canResend || isSendingOtp}
              className="mt-4 text-sm text-blue-300 hover:text-blue-100 transition duration-200 ease-in-out disabled:opacity-50"
            >
              {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
            </button>
          </>
        )}

        {step === "details" && (
          <form onSubmit={handleSignUp} className="space-y-4 w-full" noValidate>
            <div>
              <label htmlFor="email" className={baseLabelClass}>
                Verified Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className={`${baseInputClass} pr-10 opacity-70 cursor-not-allowed border-green-500`}
                  value={email}
                  disabled
                />
                <FaCheckCircle
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-xl pointer-events-none"
                  title="Verified"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className={baseLabelClass}>
                Name
              </label>
              <input
                type="text"
                id="name"
                className={`${baseInputClass} ${
                  errors.name ? "border-2 border-red-600" : ""
                }`}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1 text-left">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className={baseLabelClass}>
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`${baseInputClass} ${
                  errors.password ? "border-2 border-red-600" : ""
                }`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1 text-left">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className={baseLabelClass}>
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`${baseInputClass} pr-10 ${
                  errors.confirmPassword ? "border-2 border-red-600" : ""
                }`}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={toggleConfirmPasswordVisibility}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-black focus:outline-none"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <FiEye className="h-5 w-5" />
                ) : (
                  <FiEyeOff className="h-5 w-5" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1 text-left">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`group relative block mt-10 w-full border-2 py-3 px-8 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
                isLoading
                  ? "border-gray-400 text-gray-400 cursor-not-allowed"
                  : "border-blue-400 text-blue-300 hover:border-orange-300 hover:text-white hover:bg-orange-600 focus:ring-blue-400"
              }`}
              aria-label="Create Account"
            >
              <span className="relative z-10">
                {isLoading ? "Creating Account..." : "Create Account"}
              </span>
              <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-gray-200">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition duration-150 ease-in-out"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

