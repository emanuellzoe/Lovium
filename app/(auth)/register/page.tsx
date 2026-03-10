"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(): string | null {
    if (username.length < 3) return "Username minimal 3 karakter";
    if (!/^[a-zA-Z0-9_]+$/.test(username))
      return "Username hanya boleh huruf, angka, dan underscore";
    if (password.length < 8) return "Password minimal 8 karakter";
    if (password !== confirmPassword) return "Password tidak sama";
    return null;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Check if username is taken
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (existingUser) {
      setError("Username sudah dipakai");
      setLoading(false);
      return;
    }

    // Sign up
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Update profile with username
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", data.user.id);

      if (profileError) {
        setError("Akun dibuat tapi gagal set username. Coba login dan set ulang.");
        setLoading(false);
        return;
      }
    }

    router.push("/dashboard");
  }

  return (
    <div className="bg-dark-card border border-crimson/20 rounded-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="font-serif text-3xl font-bold text-white tracking-wider no-underline">
          LOVIU<span className="text-crimson-glow">M</span>
        </Link>
        <p className="text-muted text-sm mt-2">Buat akun baru</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-crimson/10 border border-crimson/30 rounded-lg px-4 py-3 mb-6 text-sm text-crimson-bright">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm text-muted mb-1.5">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="nama_unik"
            className="w-full bg-dark border border-crimson/20 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-crimson transition-colors"
          />
          <p className="text-xs text-muted mt-1">Huruf, angka, underscore. Min 3 karakter.</p>
        </div>

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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm text-muted mb-1.5">
            Konfirmasi Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Ulangi password"
            className="w-full bg-dark border border-crimson/20 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-crimson transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-crimson hover:bg-crimson-bright text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-muted mt-6">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-crimson-bright hover:text-crimson-glow transition-colors no-underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
