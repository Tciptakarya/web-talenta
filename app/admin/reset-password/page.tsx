import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/passwordReset";
import ResetPasswordForm from "@/components/admin/ResetPasswordForm";

export const metadata = { title: "Reset Password — Talenta Cipta Karya" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <InvalidToken />;
  }

  const hash = hashToken(token);
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hash },
  });

  const invalid =
    !record || Boolean(record.usedAt) || record.expiresAt.getTime() <= Date.now();

  if (invalid) {
    return <InvalidToken />;
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <ResetPasswordForm token={token} />
    </div>
  );
}

function InvalidToken() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-[0_20px_50px_-25px_rgba(22,33,74,0.35)] space-y-4 text-center">
        <h1 className="font-display text-xl font-semibold text-navy">Link Tidak Valid</h1>
        <p className="text-sm text-mist leading-relaxed">
          Link reset password tidak valid atau sudah kedaluwarsa.
        </p>
        <Link
          href="/admin/forgot-password"
          className="inline-flex w-full justify-center rounded-full bg-navy text-white font-bold px-6 py-3 text-sm hover:-translate-y-0.5 transition"
        >
          Minta Link Reset Baru
        </Link>
        <p>
          <Link href="/admin/login" className="text-sm font-semibold text-blue hover:text-navy underline-offset-4 hover:underline">
            Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  );
}
