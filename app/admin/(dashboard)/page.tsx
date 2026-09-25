import Link from "next/link";
import { prisma } from "@/lib/prisma";
import GantiPasswordForm from "@/components/admin/GantiPasswordForm";

export const dynamic = "force-dynamic";

const CARDS = [
  { href: "/admin/galeri", label: "Kelola Galeri", desc: "Upload, hapus, atur foto" },
  { href: "/admin/testimoni", label: "Kelola Testimoni", desc: "Tambah, edit, hapus cerita" },
  { href: "/admin/program", label: "Kelola Program", desc: "Sunting deskripsi 11 program" },
  { href: "/admin/pendaftaran", label: "Pendaftaran", desc: "Pendaftar dari tabel jadwal publik" },
  { href: "/admin/pesan", label: "Pesan Masuk", desc: "Inbox form kontak (cadangan email)" },
];

export default async function AdminDashboard() {
  const [program, galeri, testimoni, pesan, pendaftaranBaru] = await Promise.all([
    prisma.program.count().catch(() => 0),
    prisma.galleryImage.count().catch(() => 0),
    prisma.testimonial.count().catch(() => 0),
    prisma.contactMessage.count().catch(() => 0),
    prisma.pendaftaran.count({ where: { status: "baru" } }).catch(() => 0),
  ]);

  const stats = [
    { label: "Program", value: program },
    { label: "Foto Galeri", value: galeri },
    { label: "Testimoni", value: testimoni },
    { label: "Pendaftaran Baru", value: pendaftaranBaru },
    { label: "Pesan Masuk", value: pesan },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">
          Dashboard
        </h1>
        <p className="text-sm text-mist mt-1">
          Semua perubahan tampil langsung di website tanpa deploy ulang.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-line p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-mist">
              {s.label}
            </p>
            <p className="font-display text-3xl font-semibold text-navy mt-2">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl bg-navy text-white p-6 hover:-translate-y-1 transition group"
          >
            <p className="font-display text-lg font-semibold">{c.label}</p>
            <p className="text-sm text-[#B7C4EA] mt-1">{c.desc}</p>
            <span className="inline-block mt-4 text-gold text-sm font-bold group-hover:translate-x-1 transition">
              Buka →
            </span>
          </Link>
        ))}
      </div>

      <GantiPasswordForm />
    </div>
  );
}
