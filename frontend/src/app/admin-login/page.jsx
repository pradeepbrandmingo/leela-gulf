"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "@/config/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if admin is already logged in with a valid token
  useEffect(() => {
    async function verifyExistingSession() {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      try {
        const data = await apiRequest("/admin/me", { method: "GET" });
        if (data.success && data.admin) {
          router.push("/admin/dashboard");
        } else {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
        }
      } catch (e) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      }
    }

    verifyExistingSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await apiRequest("/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.success) {
        setSuccess("Login successful! Redirecting to Dashboard...");
        if (data.token) {
          localStorage.setItem("adminToken", data.token);
        }
        if (data.admin) {
          localStorage.setItem("adminUser", JSON.stringify(data.admin));
        }

        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 800);
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[var(--color-primary)] text-white flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gold-main/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-[280px] h-[280px] bg-gold-dark/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-[430px] bg-card-dark/95 backdrop-blur-2xl border border-gold-main/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative z-10 overflow-hidden">
        {/* Top Ambient Gold Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold-main to-transparent opacity-90" />

        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-3 group">
            <Image
              src="/logos/logo.png"
              alt="Leela Gulf FZC Logo"
              width={260}
              height={80}
              className="h-14 sm:h-16 w-auto object-contain mx-auto transition-transform group-hover:scale-103 duration-300 drop-shadow-[0_6px_20px_rgba(214,185,42,0.2)]"
              priority
            />
          </Link>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight mt-1">
            Admin Login
          </h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/70 border border-red-500/50 rounded-2xl flex items-start gap-2.5 text-red-200 text-xs animate-fadeIn shadow-lg">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-4 p-3 bg-gold-main/15 border border-gold-main/50 rounded-2xl flex items-start gap-2.5 text-gold-light text-xs animate-fadeIn shadow-lg">
            <ShieldCheck className="w-4 h-4 text-gold-main shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-[10px] sm:text-xs font-heading font-bold uppercase tracking-widest text-gray-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative group focus-within:text-gold-main">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gold-main transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@leelagulf.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-gold-main focus:bg-black/50 focus:shadow-[0_0_16px_rgba(214,185,42,0.25)] transition-all duration-300 font-subheading"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[10px] sm:text-xs font-heading font-bold uppercase tracking-widest text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative group focus-within:text-gold-main">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gold-main transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-gold-main focus:bg-black/50 focus:shadow-[0_0_16px_rgba(214,185,42,0.25)] transition-all duration-300 font-subheading"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-gold-animated py-3 px-5 rounded-2xl text-black font-heading font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(214,185,42,0.35)] hover:shadow-[0_6px_25px_rgba(214,185,42,0.55)] active:scale-[0.99] transition-all duration-300 cursor-pointer disabled:opacity-70 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 text-black animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In To Dashboard</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>
        </form>

        {/* Back to Website Footer Link */}
        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <Link
            href="/"
            className="text-[11px] sm:text-xs font-subheading text-gray-400 hover:text-gold-light transition-colors"
          >
            ← Return to Leela Gulf Main Site
          </Link>
        </div>

      </div>
    </div>
  );
}
