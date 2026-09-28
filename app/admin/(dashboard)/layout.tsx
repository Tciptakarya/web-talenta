import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blobEnabled } from "@/lib/storage";
import SignOutButton from "@/components/admin/SignOutButton";
import AdminNav from "@/components/admin/AdminNav";
import ThemeToggle from "@/components/site/ThemeToggle";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const [pesanCount, fotoCount, pendaftaranBaru] = await Promise.all([
    prisma.contactMessage.count().catch(() => 0),
    prisma.galleryImage.count().catch(() => 0),
    prisma.pendaftaran.count({ where: { status: "baru" } }).catch(() => 0),
  ]);

  return (
    <div className="min-h-screen md:min-h-0 md:h-dvh bg-paper text-ink flex md:overflow-hidden">
      <aside className="admin-sidebar w-64 shrink-0 md:h-full bg-navy text-white p-6 hidden md:flex flex-col gap-6">
        <div>
          <p className="font-display text-lg font-semibold">Talenta Cipta Karya</p>
          <p className="text-xs text-[#B7C4EA] mt-1">Dashboard Admin</p>
        </div>
        {/* Menu + active state ada di AdminNav (client, usePathname). */}
        <AdminNav
          pesanCount={pesanCount}
          fotoCount={fotoCount}
          pendaftaranBaru={pendaftaranBaru}
        />
        <div className="mt-auto shrink-0 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p
              className="text-[11px] text-[#8B98BE] break-words min-w-0"
              title={session.user?.email ?? undefined}
            >
              {session.user?.email}
            </p>
            <ThemeToggle />
          </div>
          <SignOutButton />
        </div>
      </aside>

      <div className="flex-1 min-w-0 md:h-full md:flex md:flex-col">
        {/* Nav mobile — pola active state sama, tidak diduplikasi. */}
        <div className="md:hidden shrink-0 bg-navy text-white p-4 flex items-center gap-3 overflow-x-auto">
          <AdminNav
            variant="mobile"
            pesanCount={pesanCount}
            fotoCount={fotoCount}
            pendaftaranBaru={pendaftaranBaru}
          />
          <span className="ml-auto" />
          <ThemeToggle />
          <SignOutButton inline />
        </div>
        {/* Area konten: satu-satunya yang scroll. Sidebar & nav mobile tetap diam. */}
        <div className="md:flex-1 md:min-h-0 md:overflow-y-auto">
          <main className="p-6 md:p-10 max-w-5xl">{children}</main>
          <p className="px-6 md:px-10 pb-8 text-xs text-mist">
            Mode penyimpanan foto:{" "}
            <strong>{blobEnabled() ? "Vercel Blob" : "lokal (public/uploads)"}</strong>{" "}
            · Notifikasi email:{" "}
            <strong>{process.env.RESEND_API_KEY ? "Resend aktif" : "belum aktif (RESEND_API_KEY kosong)"}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
