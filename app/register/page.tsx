"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
      "Password must contain at least 1 uppercase letter and 1 special character"
    ),
});

export default function Register() {
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

  const handleSubmit = async (values: any, { setSubmitting, setErrors }: any) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        alert("Account created successfully!");
        window.location.href = "/login";
      } else {
        const data = await res.json();
        setErrors({ email: data.message || "Registration failed" });
      }
    } catch {
      setErrors({ email: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* 🌌 Cosmic Background */}
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
          <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-60 animate-blob" />
          <div className="absolute top-32 right-10 w-80 h-80 bg-pink-600 rounded-full blur-3xl opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-60 animate-blob animation-delay-4000" />
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

      {/* Animations */}
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

      {/* 💎 Glass Register Card */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10 hover:shadow-3xl transition-shadow duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-3 drop-shadow-lg">
                Create Account 🚀
              </h2>
              <p className="text-sm text-gray-200">
                Start your cosmic productivity journey
              </p>
            </div>

            <Formik
              initialValues={{ name: "", email: "", password: "" }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none text-gray-800 text-lg"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-400 text-sm mt-1 text-center"
                    />
                  </div>

                  <div>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none text-gray-800 text-lg"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-400 text-sm mt-1 text-center"
                    />
                  </div>

                  <div>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none text-gray-800 text-lg"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-400 text-sm mt-1 text-center"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-60 text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition transform hover:scale-105"
                  >
                    {isSubmitting ? "Creating account..." : "Register"}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="text-center mt-8 text-gray-300">
              Already have an account?{" "}
              <a href="/login" className="font-bold text-indigo-300 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
