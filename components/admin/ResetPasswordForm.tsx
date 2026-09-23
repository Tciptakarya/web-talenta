"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetPassword, type ActionState } from "@/app/admin/actions";

const INPUT =
  "w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-3 text-sm focus:outline-none focus:border-blue focus:ring-4 focus:ring-[rgba(78,127,240,0.15)]";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionState | undefined, FormData>(
    resetPassword,
    undefined
  );

  useEffect(() => {
    if (state?.ok) {
      const t = setTimeout(() => router.push("/admin/login"), 2200);
      return () => clearTimeout(t);
    }
  }, [state, router]);

  if (state?.ok) {
    return (
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-[0_20px_50px_-25px_rgba(22,33,74,0.35)] space-y-4 text-center">
        <h1 className="font-display text-xl font-semibold text-navy">Password Berhasil Diubah</h1>
        <p className="text-sm text-mist">{state.message}</p>
        <p className="text-xs text-mist">Mengalihkan ke halaman login...</p>
        <Link
          href="/admin/login"
          className="inline-flex w-full justify-center rounded-full bg-navy text-white font-bold px-6 py-3 text-sm"
        >
          Ke Halaman Login
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
        <h1 className="font-display text-2xl font-semibold text-navy">Atur Password Baru</h1>
        <p className="text-sm text-mist mt-1">Masukkan password baru Anda (minimal 8 karakter).</p>
      </div>

      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="newPassword" className="block text-xs font-bold text-navy mb-1.5">
          Password Baru
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          placeholder="••••••••"
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-xs font-bold text-navy mb-1.5">
          Konfirmasi Password Baru
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          placeholder="••••••••"
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
        {pending ? "Menyimpan..." : "Simpan Password Baru"}
      </button>
    </form>
  );
}
