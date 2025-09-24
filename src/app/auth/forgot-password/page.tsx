'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import API from '@/utils/api';
import { ZodError } from 'zod';
import { emailSchema, ResetPasswordSchema } from '@/lib/schema/user.schema';

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);


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
      emailSchema.parse(email);
      await API.post("/auth/sendOTP", { email, purpose: "reset" });
      toast.success("OTP sent to your email");
      setStep("otp");
      setCanResend(false);
      setResendTimer(60);
    } catch (err: any) {
      const msg =
        err instanceof ZodError
          ? err.issues[0]?.message
          : err.response?.data?.message || "Failed to send OTP";
      setErrors({ email: msg });
      toast.error(msg);
    } finally {
      setIsSendingOtp(false)
    }
  };

  const verifyOtp = async () => {
    setErrors({});
    setIsVerifyingOtp(true);
    try {
      const otp = otpDigits.join("");
      if (otp.length !== 6) throw new Error("OTP must be 6 digits");
      await API.post("/auth/verifyOTP", { email, otp });
      toast.success("OTP verified");
      setStep("reset");
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "OTP verification failed";
      setErrors({ otp: msg });
      toast.error(msg);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const resetPassword = async () => {
    setErrors({});
    setIsLoading(true);
    try {
      ResetPasswordSchema.parse({ password, confirmPassword });
      await API.post("/auth/reset-password", { email, password });
      toast.success("Password reset successfully");
      router.push("/auth/login");
    } catch (err: any) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const key = issue.path[0];
          if (typeof key === "string" || typeof key === "number") {
            newErrors[key] = issue.message;
          }
        });

        setErrors(newErrors);
      } else {
        const msg = err.response?.data?.message || "Password reset failed";
        setErrors({ general: msg });
        toast.error(msg);
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
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const baseInputClass =
    "w-full p-3 rounded-2xl bg-white bg-opacity-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out hover:border-blue-400 hover:border-opacity-70 shadow-inner";
  const baseLabelClass =
    "block text-sm font-medium text-gray-200 mb-1 text-left";

  return (
    <div className="min-h-screen bg-cover bg-center lendingPage flex flex-col items-center justify-center p-4 font-sans">
      <div className="relative bg-opacity-15 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-700 border-opacity-30 p-8 max-w-md w-full text-center bg-black/40">
        <h1 className="text-white text-4xl font-semibold mb-8">
          Reset{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Password
          </span>
        </h1>

        {step === "email" && (
          <>
            <label htmlFor="email" className={baseLabelClass}>
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`${baseInputClass} ${
                errors.email ? "border-2 border-red-600" : ""
              }`}
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSendingOtp}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1 text-left">
                {errors.email}
              </p>
            )}
            <button
              onClick={sendOtp}
              disabled={isSendingOtp || !email}
              className="btn mt-6 w-1/2 rounded-2xl bg-gradient-to-br from-orange-600 to-purple-700 text-white font-semibold py-2 px-4 transition duration-300 ease-in-out hover:opacity-90 disabled:opacity-50"
            >
              {isSendingOtp ? "Sending OTP" : "Send OTP"}
            </button>
          </>
        )}

        {step === "otp" && (
          <div className="flex flex-col items-center justify-center gap-4 mt-4">
            <label htmlFor="otp" className={`${baseLabelClass} text-center`}>
              Enter OTP
            </label>

            <div className="flex gap-2 justify-center mb-2">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
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
              onClick={verifyOtp}
              disabled={isVerifyingOtp|| otpDigits.some((d) => d === "")}
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
          </div>
        )}

        {step === "reset" && (
          <>
            <label htmlFor="password" className={baseLabelClass}>
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className={`${baseInputClass} ${
                errors.password ? "border-2 border-red-600" : ""
              }`}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1 text-left">
                {errors.password}
              </p>
            )}

            <label
              htmlFor="confirmPassword"
              className={`${baseLabelClass} mt-4`}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                className={`${baseInputClass} pr-10 ${
                  errors.confirmPassword ? "border-2 border-red-600" : ""
                }`}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-black"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1 text-left">
                {errors.confirmPassword}
              </p>
            )}

            <button
              onClick={resetPassword}
              disabled={isLoading || !password || !confirmPassword}
              className="btn mt-6 w-1/2 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white font-semibold py-2 px-4 transition duration-300 ease-in-out hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        {errors.general && (
          <p className="text-red-400 text-sm mt-4 text-center">
            {errors.general}
          </p>
        )}

        <p className="mt-6 text-gray-200">
          Back to{" "}
          <a
            href="/auth/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition duration-150"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
