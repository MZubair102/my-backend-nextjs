"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";

// Types
interface ResetPasswordFormValues {
  otp: string;
  password: string;
}

// Validation schema
const ResetPasswordSchema = Yup.object().shape({
  otp: Yup.string().length(6, "OTP must be 6 digits").required("Required"),
  password: Yup.string().min(6, "Password too short").required("Required"),
});

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
    setFieldValue: any,
    otp: string
  ) => {
    const val = e.target.value;
    if (/^[0-9]?$/.test(val)) {
      const otpArr = otp.split("");
      otpArr[idx] = val;
      setFieldValue("otp", otpArr.join(""));
      if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleResetPassword = async (
    values: ResetPasswordFormValues,
    { setSubmitting }: FormikHelpers<ResetPasswordFormValues>
  ) => {
    if (!email) {
      setError("Invalid link or missing email.");
      setSubmitting(false);
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: values.otp,
          newPassword: values.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password reset successful 🎉");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (!email) return;
    try {
      await fetch("/api/auth/otp/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setMessage("OTP resent!");
      setTimer(300);
    } catch {
      setError("Failed to resend OTP");
    }
  };

  const sparkles = [
    { left: 15, top: 20, delay: 0, duration: 20 },
    { left: 40, top: 50, delay: 2, duration: 25 },
    { left: 70, top: 15, delay: 4, duration: 30 },
    { left: 25, top: 75, delay: 6, duration: 35 },
    { left: 85, top: 40, delay: 8, duration: 40 },
    { left: 50, top: 90, delay: 10, duration: 45 },
    { left: 10, top: 60, delay: 12, duration: 50 },
    { left: 90, top: 20, delay: 14, duration: 55 },
    { left: 60, top: 10, delay: 16, duration: 60 },
    { left: 35, top: 35, delay: 18, duration: 65 },
    { left: 80, top: 80, delay: 20, duration: 70 },
    { left: 5, top: 5, delay: 22, duration: 75 },
  ];

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1538370965047-78c8f3e0c14e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob" />
          <div className="absolute top-32 right-10 w-80 h-80 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-60 animation-delay-2000 animate-blob" />
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-60 animation-delay-4000 animate-blob" />
        </div>

        {/* Sparkles */}
        <div className="absolute inset-0">
          {sparkles.map((s, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-50 animate-float"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(40px, -60px) scale(1.15);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 14s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-40px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>

      {/* Reset Password Card */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10 hover:shadow-3xl transition-shadow duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-3 drop-shadow-lg animate-pulse">
                Reset Password 🔑
              </h2>
              <p className="text-sm text-gray-200 mb-2">
                OTP sent to <b>{email}</b>
              </p>
              <p className="text-gray-200">Time left: {formatTime(timer)}</p>
            </div>

            <Formik
              initialValues={{ otp: "", password: "" }}
              validationSchema={ResetPasswordSchema}
              onSubmit={handleResetPassword}
            >
              {({ values, setFieldValue, handleSubmit }) => (
                <Form onSubmit={handleSubmit} className="space-y-6">
                  {/* OTP Inputs */}
                  <div className="flex justify-between gap-2">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg rounded-2xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-300 outline-none text-gray-800 transition-shadow hover:shadow-md"
                        ref={(el) => { otpRefs.current[idx] = el; }}
                        value={values.otp[idx] || ""}
                        onChange={(e) => handleOtpChange(e, idx, setFieldValue, values.otp)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        disabled={timer === 0}
                      />
                    ))}
                  </div>

                  {/* Resend OTP */}
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={timer > 0}
                    className="w-full text-indigo-300 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend OTP
                  </button>

                  {/* Password */}
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full px-6 py-4 pr-14 rounded-2xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-300 outline-none text-gray-800 text-lg shadow-sm"
                        value={values.password}
                        onChange={(e) => setFieldValue("password", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-4 flex items-center text-indigo-200"
                      >
                        {showPassword ? <EyeOff size={28} /> : <Eye size={28} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || timer === 0}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>

                  {error && (
                    <div className="text-red-400 text-sm text-center mt-2 bg-red-900/30 border border-red-500/40 rounded-xl py-2 px-3">
                      {error}
                    </div>
                  )}
                  {message && (
                    <div className="text-green-400 text-sm text-center mt-2 bg-green-900/30 border border-green-500/40 rounded-xl py-2 px-3">
                      {message} <br /> Redirecting to login...
                    </div>
                  )}
                </Form>
              )}
            </Formik>

            <p className="text-center mt-8 text-gray-300">
              Remembered your password?{" "}
              <a
                href="/login"
                className="font-bold text-indigo-300 hover:text-indigo-400 hover:underline transition"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
