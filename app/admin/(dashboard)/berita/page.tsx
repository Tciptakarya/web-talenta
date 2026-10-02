import { prisma } from "@/lib/prisma";
import BeritaManager, { type AdminBerita } from "@/components/admin/BeritaManager";
import { ymdWib } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Berita — Admin" };

export default async function BeritaPage() {
  // Query langsung di halaman (bukan `getBeritaAdmin()` dari lib/data.ts)
  // supaya Draft ikut terbawa. `getBeritaAdmin` sengaja tidak dipakai di sini
  // karena isActive=false tidak boleh bocor ke mana pun kecuali panel ini.
  const rows = await prisma.berita
    .findMany({ orderBy: [{ tanggal: "desc" }, { createdAt: "desc" }] })
    .catch(() => []);

  const items: AdminBerita[] = rows.map((r) => {
    // Pisahkan "yt:<id>" / "vm:<id>" / "ig:<kode>" jadi id + host untuk form.
    const m = r.videoLink?.match(/^(yt|vm|ig):(.+)$/);
    return {
      id: r.id,
      judul: r.judul,
      slug: r.slug,
      ringkasan: r.ringkasan,
      isi: r.isi,
      imageUrl: r.imageUrl,
      imageAlt: r.imageAlt,
      videoUrl: r.videoUrl,
      videoLink: m ? m[2] : null,
      videoHost: m
        ? m[1] === "yt"
          ? "youtube"
          : m[1] === "vm"
            ? "vimeo"
            : "instagram"
        : null,
      orientasi: r.orientasi === "vertical" ? "vertical" : "horizontal",
      tanggal: ymdWib(r.tanggal),
      kategori: r.kategori,
      isActive: r.isActive,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Kelola Berita</h1>
        <p className="text-sm text-mist mt-1">
          Tulis kabar kegiatan Talenta Cipta Karya. Tidak centang &ldquo;Tayevangkan di
          website&rdquo; untuk menyimpan sebagai draft — draft tidak muncul di halaman publik,
          termasuk tidak bisa dibuka lewat URL-nya.
        </p>
      </div>
      <BeritaManager items={items} />
    </div>
  );
}
