"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

/** Form login admin — NextAuth credentials (PRD §6). */
export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email atau password salah.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-[0_20px_50px_-25px_rgba(22,33,74,0.35)] space-y-4"
    >
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy">
          Login Admin
        </h1>
        <p className="text-sm text-mist mt-1">
          Masuk untuk mengelola konten website.
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-bold text-navy mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="info@talentaciptakarya.com"
          className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-3 text-sm focus:outline-none focus:border-blue focus:ring-4 focus:ring-[rgba(78,127,240,0.15)]"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-bold text-navy mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-3 text-sm focus:outline-none focus:border-blue focus:ring-4 focus:ring-[rgba(78,127,240,0.15)]"
        />
      </div>

      {error && (
        <p className="text-sm font-semibold text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-navy text-white font-bold px-6 py-3 text-sm hover:-translate-y-0.5 transition disabled:opacity-70"
      >
        {loading ? "Memeriksa..." : "Masuk"}
      </button>

      <p className="text-center text-sm">
        <Link
          href="/admin/forgot-password"
          className="font-semibold text-blue hover:text-navy underline-offset-4 hover:underline"
        >
          Lupa Password?
        </Link>
      </p>
    </form>
  );
}
