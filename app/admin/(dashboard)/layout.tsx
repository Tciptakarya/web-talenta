import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blobEnabled } from "@/lib/storage";
import SignOutButton from "@/components/admin/SignOutButton";
import ThemeToggle from "@/components/site/ThemeToggle";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/galeri", label: "Galeri" },
  { href: "/admin/testimoni", label: "Testimoni" },
  { href: "/admin/program", label: "Program" },
  { href: "/admin/jadwal", label: "Jadwal Pelatihan" },
  { href: "/admin/pendaftaran", label: "Pendaftaran" },
  { href: "/admin/materi", label: "Materi Pelatihan" },
  { href: "/admin/kategori", label: "Kategori Kelas" },
  { href: "/admin/pesan", label: "Pesan Masuk" },
];

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
    <div className="min-h-screen bg-paper text-ink flex">
      <aside className="w-64 shrink-0 bg-navy text-white p-6 flex flex-col gap-6 max-md:hidden">
        <div>
          <p className="font-display text-lg font-semibold">Talenta Cipta Karya</p>
          <p className="text-xs text-[#B7C4EA] mt-1">Dashboard Admin</p>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-[#C4CDE8] hover:bg-white/10 hover:text-white transition"
            >
              {n.label}
              {n.href === "/admin/pesan" && pesanCount > 0 && (
                <span className="ml-2 inline-block rounded-full bg-gold text-navy text-xs font-bold px-2 py-0.5">
                  {pesanCount}
                </span>
              )}
              {n.href === "/admin/galeri" && (
                <span className="ml-2 text-xs text-[#8B98BE]">{fotoCount}</span>
              )}
              {n.href === "/admin/pendaftaran" && pendaftaranBaru > 0 && (
                <span className="ml-2 inline-block rounded-full bg-gold text-navy text-xs font-bold px-2 py-0.5">
                  {pendaftaranBaru}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-[#8B98BE] break-all">
              {session.user?.email}
            </p>
            <ThemeToggle />
          </div>
          <SignOutButton />
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Nav mobile */}
        <div className="md:hidden bg-navy text-white p-4 flex items-center gap-3 overflow-x-auto">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm font-semibold text-[#C4CDE8] whitespace-nowrap"
            >
              {n.label}
            </Link>
          ))}
          <span className="ml-auto" />
          <ThemeToggle />
          <SignOutButton inline />
        </div>
        <main className="p-6 md:p-10 max-w-5xl">{children}</main>
        <p className="px-6 md:px-10 pb-8 text-xs text-mist">
          Mode penyimpanan foto:{" "}
          <strong>{blobEnabled() ? "Vercel Blob" : "lokal (public/uploads)"}</strong>{" "}
          · Notifikasi email:{" "}
          <strong>{process.env.RESEND_API_KEY ? "Resend aktif" : "belum aktif (RESEND_API_KEY kosong)"}</strong>
        </p>
      </div>
    </div>
  );
}
