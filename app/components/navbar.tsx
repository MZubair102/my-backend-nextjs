"use client";

import { useEffect, useState } from "react";
import { CheckCircle, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ for detecting current route

type User = {
  name: string;
  email: string;
};

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname(); // current path

  // Load user
  async function loadUser() {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.success) setUser(data.user as User);
    } catch (err) {
      console.error("Failed to load user");
    }
  }

  // Logout
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <nav className="bg-gradient-to-r from-indigo-600/80 via-purple-600/80 to-pink-600/80 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center">
            <CheckCircle className="h-9 w-9 text-white drop-shadow-lg" />
            <span className="ml-3 text-2xl font-bold text-white drop-shadow-lg">
              TodoMaster
            </span>

            {/* Desktop Links */}
            <div className="hidden md:block ml-12">
              <div className="flex items-baseline space-x-10">
                <Link
                  href="/todos"
                  className={`text-white px-3 py-2 font-bold border-b-2 ${
                    pathname === "/todos" ? "border-white" : "border-transparent"
                  }`}
                >
                  Todos
                </Link>
                <Link
                  href="/todos/stat"
                  className={`text-white hover:text-white px-3 py-2 text-base font-bold transition ${
                    pathname === "/todos/stat" ? "border-b-2 border-white" : "border-b-2 border-transparent"
                  }`}
                >
                  Stats
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop User */}
          <div className="hidden md:flex items-center space-x-5">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-4 text-white">
                  <div className="w-11 h-11 rounded-full bg-white/25 flex items-center justify-center font-bold text-xl border-2 border-white/40">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-base font-semibold">{user.name}</p>
                    <p className="text-sm text-white/70">{user.email}</p>
                  </div>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-4 w-52 rounded-2xl shadow-2xl bg-white/95 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                  <button
                    onClick={handleLogout}
                    className="w-full px-6 py-4 text-left flex items-center space-x-4 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-600">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <span className="text-white/80">Loading user...</span>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 text-white"
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-purple-700/90 to-pink-700/90 border-t border-white/20">
          <div className="px-6 pt-6 pb-8 space-y-5">
            <Link
              href="/todos"
              className={`block px-5 py-4 text-xl font-bold rounded-xl ${
                pathname === "/todos" ? "bg-white/25" : "bg-white/10"
              } text-white`}
            >
              Todos
            </Link>
            <Link
              href="/todos/stat"
              className={`block px-5 py-4 text-xl font-bold rounded-xl ${
                pathname === "/todos/stat" ? "bg-white/25" : "bg-white/10"
              } text-white/90`}
            >
              Stats
            </Link>
          </div>

          {user && (
            <div className="px-6 pb-8 border-t border-white/20 pt-6">
              <div className="flex items-center space-x-5 mb-6">
                <div className="w-14 h-14 rounded-full bg-white/25 flex items-center justify-center text-2xl font-bold border-2 border-white/40">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{user.name}</p>
                  <p className="text-white/70">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold flex justify-center space-x-3"
              >
                <LogOut className="h-6 w-6" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
