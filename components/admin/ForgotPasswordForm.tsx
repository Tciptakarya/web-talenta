"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, type ActionState } from "@/app/admin/actions";

const INPUT =
  "w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-3 text-sm focus:outline-none focus:border-blue focus:ring-4 focus:ring-[rgba(78,127,240,0.15)]";

export default function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<ActionState | undefined, FormData>(
    requestPasswordReset,
    undefined
  );

  // Jika sudah sukses tampilkan pesan generik saja
  if (state?.ok && state.message) {
    return (
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-[0_20px_50px_-25px_rgba(22,33,74,0.35)] space-y-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">Periksa Email Anda</h1>
          <p className="text-sm text-mist mt-2 leading-relaxed">{state.message}</p>
        </div>
        <Link
          href="/admin/login"
          className="inline-flex w-full justify-center rounded-full bg-navy text-white font-bold px-6 py-3 text-sm hover:-translate-y-0.5 transition"
        >
          Kembali ke Login
        </Link>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-[0_20px_50px_-25px_rgba(22,33,74,0.35)] space-y-4"
    >
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy">Lupa Password?</h1>
        <p className="text-sm text-mist mt-1 leading-relaxed">
          Masukkan email akun admin Anda untuk mendapatkan link untuk mengatur ulang password.
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
          className={INPUT}
        />
      </div>

      {state?.error && (
        <p className="text-sm font-semibold text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-navy text-white font-bold px-6 py-3 text-sm hover:-translate-y-0.5 transition disabled:opacity-70"
      >
        {pending ? "Mengirim..." : "Kirim Link Reset Password"}
      </button>

      <p className="text-center text-sm">
        <Link href="/admin/login" className="font-semibold text-blue hover:text-navy underline-offset-4 hover:underline">
          Kembali ke Login
        </Link>
      </p>
    </form>
  );
}
