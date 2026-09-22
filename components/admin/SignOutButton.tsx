"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton({ inline = false }: { inline?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className={
        inline
          ? "text-sm font-semibold text-gold whitespace-nowrap"
          : "w-full rounded-lg bg-white/10 hover:bg-white/20 transition px-3 py-2 text-sm font-semibold text-white"
      }
    >
      Keluar
    </button>
  );
}
