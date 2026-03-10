"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="bg-dark-card border border-crimson/20 rounded-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="font-serif text-3xl font-bold text-white tracking-wider no-underline">
          LOVIU<span className="text-crimson-glow">M</span>
        </Link>
        <p className="text-muted text-sm mt-2">Masuk ke akunmu</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-crimson/10 border border-crimson/30 rounded-lg px-4 py-3 mb-6 text-sm text-crimson-bright">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-muted mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="nama@email.com"
            className="w-full bg-dark border border-crimson/20 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-crimson transition-colors"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-muted mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Minimal 8 karakter"
            className="w-full bg-dark border border-crimson/20 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-crimson transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-crimson hover:bg-crimson-bright text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-muted">atau</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Google OAuth */}
      <button
        onClick={handleGoogleLogin}
        className="w-full border border-white/10 hover:border-white/30 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Masuk dengan Google
      </button>

      {/* Register link */}
      <p className="text-center text-sm text-muted mt-6">
        Belum punya akun?{" "}
        <Link href="/register" className="text-crimson-bright hover:text-crimson-glow transition-colors no-underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
