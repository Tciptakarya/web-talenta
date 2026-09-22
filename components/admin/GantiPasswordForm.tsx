"use client";

import { useEffect, useRef, useActionState } from "react";
import { gantiPassword, type ActionState } from "@/app/admin/actions";

const INPUT =
  "w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue";

/**
 * Form ganti password admin (dashboard /admin).
 * Wajib ada di produksi: hosting managed tidak menyediakan akses shell
 * untuk menjalankan script perubahan password secara manual.
 */
export default function GantiPasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ActionState | undefined, FormData>(
    gantiPassword,
    undefined
  );

  // Bersihkan field setelah berhasil diganti
  useEffect(() => {
    if (state?.ok && formRef.current) formRef.current.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="rounded-2xl bg-white border border-line p-5 space-y-3"
    >
      <div>
        <h2 className="font-display text-lg font-semibold text-navy">
          Keamanan Akun
        </h2>
        <p className="text-xs text-mist mt-1">
          Ganti password admin. Minimal 8 karakter — simpan di tempat aman.
        </p>
      </div>

      <input
        name="currentPassword"
        type="password"
        required
        autoComplete="current-password"
        placeholder="Password lama"
        className={INPUT}
      />

      <div className="grid sm:grid-cols-2 gap-3">
        <input
          name="newPassword"
          type="password"
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          placeholder="Password baru (min. 8 karakter)"
          className={INPUT}
        />
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          placeholder="Ulangi password baru"
          className={INPUT}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-navy text-white font-bold px-5 py-2 text-sm disabled:opacity-70"
        >
          {pending ? "Menyimpan..." : "Simpan Password"}
        </button>
        {state?.error && (
          <p className="text-sm font-semibold text-red-600">{state.error}</p>
        )}
        {state?.ok && (
          <p className="text-sm font-semibold text-blue">{state.message}</p>
        )}
      </div>
    </form>
  );
}
