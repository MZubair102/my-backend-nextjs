"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// Validation schema
const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
});

export default function VerifyOtp() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [timer, setTimer] = useState(300); // 5 minutes
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
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (values: { otp: string }) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailFromUrl, otp: values.otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("OTP verified! Redirecting to login...");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await fetch("/api/auth/otp/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailFromUrl }),
      });
      setMessage("OTP resent!");
      setTimer(300);
    } catch {
      setError("Failed to resend OTP");
    }
  };

  // Sparkles for background
  const sparkles = [
    { left: 15, top: 20, delay: 0, duration: 20 },
    { left: 40, top: 50, delay: 2, duration: 25 },
    { left: 70, top: 15, delay: 4, duration: 30 },
    { left: 25, top: 75, delay: 6, duration: 35 },
    { left: 85, top: 40, delay: 8, duration: 40 },
    { left: 50, top: 90, delay: 10, duration: 45 },
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

      {/* OTP Card */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10 hover:shadow-3xl transition-shadow duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-3 drop-shadow-lg animate-pulse">
                Verify Your Email ✨
              </h2>
              <p className="text-sm text-gray-200">
                OTP sent to <b>{emailFromUrl}</b>
              </p>
              <p className="text-gray-200 mt-2">
                Time left: {formatTime(timer)}
              </p>
            </div>

            <Formik
              initialValues={{ otp: "" }}
              validationSchema={OtpSchema}
              onSubmit={handleVerifyOtp}
            >
              {({ values, setFieldValue, handleSubmit }) => (
                <Form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex justify-between gap-2">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-300 outline-none text-gray-800 transition-shadow hover:shadow-md"
                        ref={(el) => {
                          otpRefs.current[idx] = el;
                        }}
                        value={values.otp[idx] || ""}
                        onChange={(e) =>
                          handleOtpChange(e, idx, setFieldValue, values.otp)
                        }
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || timer === 0}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={resendOtp}
                    className="w-full text-indigo-300 font-semibold hover:underline"
                  >
                    Resend OTP
                  </button>

                  {error && (
                    <p className="text-red-400 text-sm mt-2 text-center">
                      {error}
                    </p>
                  )}
                  {message && (
                    <p className="text-green-400 text-sm mt-2 text-center bg-green-900/30 border border-green-500/40 rounded-xl py-2 px-3">
                      {message}
                    </p>
                  )}

                  {/* Login */}
                  <p className="text-center mt-4 text-gray-300">
                    Back To{" "}
                    <a
                      href="/login"
                      className="font-bold text-indigo-300 hover:text-indigo-400 hover:underline transition"
                    >
                      Login
                    </a>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}
