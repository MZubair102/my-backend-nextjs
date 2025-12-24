"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sparkles = [
    { left: 15, top: 20, delay: 0, duration: 20 },
    { left: 40, top: 50, delay: 2, duration: 25 },
    { left: 70, top: 15, delay: 4, duration: 30 },
    { left: 25, top: 75, delay: 6, duration: 35 },
    { left: 85, top: 40, delay: 8, duration: 40 },
  ];

  const handleForgotPassword = async (values: { email: string }) => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "OTP sent successfully 📧");

        setTimeout(() => {
          window.location.href = `/auth/reset-password?email=${encodeURIComponent(
            values.email
          )}`;
        }, 2000);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.15); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 14s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-40px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float linear infinite; }
      `}</style>

      {/* Forgot Password Card */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10 hover:shadow-3xl transition-shadow duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-3 drop-shadow-lg animate-pulse">
                Forgot Password 🔐
              </h2>
              <p className="text-sm text-gray-200">
                Enter your email to receive an OTP
              </p>
            </div>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={handleForgotPassword}
            >
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-300 outline-none text-gray-800 text-lg transition-all shadow-sm hover:shadow-md"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-400 text-sm mt-1 text-center"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>

                {error && (
                  <div className="text-red-400 text-sm text-center mt-2 bg-red-900/30 border border-red-500/40 rounded-xl py-2 px-3">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="text-green-400 text-sm text-center mt-2 bg-green-900/30 border border-green-500/40 rounded-xl py-2 px-3">
                    {message} <br />
                    Redirecting to OTP verification...
                  </div>
                )}
              </Form>
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
