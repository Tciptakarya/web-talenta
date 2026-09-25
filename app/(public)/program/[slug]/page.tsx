import { notFound } from "next/navigation";
import Link from "next/link";
import {
  formatTanggalYmd,
  getProgramBySlug,
  getJadwalByProgram,
  getProgramsByCategory,
  sisaKursi,
} from "@/lib/data";
import FormPendaftaran from "@/components/site/FormPendaftaran";
import KuotaBadge from "@/components/site/KuotaBadge";

/** Nomor WhatsApp resmi — konsisten dengan Footer/Kontak (0811-9700-322). */
const WA_NUMBER = "628119700322";

function waUrl(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

interface Props {
  params: Promise<{ slug: string }>;
}

// formatTanggalYmd dipakai bersama dari "@/lib/data" (hindari duplikasi).

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) {
    return { title: "Program tidak ditemukan | Talenta Cipta Karya" };
  }
  const kategori = program.category;
  return {
    title: `${program.judul} | Talenta Cipta Karya`,
    description: program.deskripsi,
    openGraph: {
      title: `${program.judul} | Talenta Cipta Karya`,
      description: program.deskripsi,
      images: kategori?.image ? [{ url: kategori.image }] : [],
    },
  };
}

/** Detail program publik — tujuan link "Selengkapnya →" di /kelas/[slug]. */
export default async function ProgramSlugPage({ params }: Props) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program || !program.isActive) {
    notFound();
  }

  const [jadwalList, siblingPrograms] = await Promise.all([
    getJadwalByProgram(program.id),
    program.categoryId
      ? getProgramsByCategory(program.categoryId)
      : Promise.resolve([]),
  ]);
  const relatedPrograms = siblingPrograms.filter((p) => p.id !== program.id);
  // Kolom kuota hanya tampil bila minimal satu jadwal punya batas kapasitas.
  const adaKuota = jadwalList.some((j) => j.kuota !== null);

  return (
    <div className="section section-alt section-page" id="program-detail">
      <div className="wrap">
        {/* Back to category (atau daftar kategori jika tanpa kategori) */}
        <Link
          href={program.category ? `/kelas/${program.category.slug}` : "/kelas"}
          className="inline-flex items-center gap-1 text-sm text-navy hover:text-gold mb-6"
        >
          ←
          {program.category
            ? ` Kembali ke ${program.category.name}`
            : " Kembali ke semua kategori"}
        </Link>

        {/* Hero */}
        <div className="section-head mb-8">
          {program.category && (
            <Link
              href={`/kelas/${program.category.slug}`}
              className="kicker hover:text-gold transition"
            >
              {program.category.name}
            </Link>
          )}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy">
            {program.judul.toUpperCase()}
          </h1>
          <p className="mt-2 text-lg text-mist max-w-2xl">
            {program.deskripsi}
          </p>
        </div>

        {/* Jadwal Pelatihan program ini */}
        <section aria-labelledby="jadwal-heading" className="mb-12">
          <h2
            id="jadwal-heading"
            className="font-display text-2xl font-semibold text-navy mb-6"
          >
            Jadwal Pelatihan
          </h2>
          {jadwalList.length > 0 ? (
            <>
              <div className="rounded-2xl bg-white border border-line overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line text-xs font-bold text-navy">
                    <th className="px-4 py-3">Hari / Tanggal</th>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Instruktur</th>
                    <th className="px-4 py-3">Ruangan</th>
                    {adaKuota && <th className="px-4 py-3">Kuota</th>}
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {jadwalList.map((j) => {
                    const kursi = sisaKursi(j);
                    const jadwalLabel = j.tanggal
                      ? `${j.hari}, ${formatTanggalYmd(j.tanggal)}`
                      : `Setiap ${j.hari}`;
                    const jamLabel = `${j.jamMulai} - ${j.jamAkhir} WIB`;
                    return (
                      <tr key={j.id} className="border-b border-line last:border-0">
                        <td className="px-4 py-3">
                          <span className="inline-block rounded-full bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-400/30 px-3 py-1 text-xs font-bold whitespace-nowrap">
                            {jadwalLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-ink whitespace-nowrap">
                          {jamLabel}
                        </td>
                        <td className="px-4 py-3 text-sm text-ink">
                          {j.instruktur ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-ink">
                          {j.ruangan ?? "—"}
                        </td>
                        {adaKuota && (
                          <td className="px-4 py-3">
                            {kursi ? (
                              <KuotaBadge kursi={kursi} />
                            ) : (
                              <span className="text-sm text-mist">—</span>
                            )}
                          </td>
                        )}
                        <td className="px-4 py-3 text-right">
                          <FormPendaftaran
                            target={{
                              jadwalId: j.id,
                              programJudul: program.judul,
                              jadwalLabel,
                              jamLabel,
                              ruangan: j.ruangan,
                              waUrl: waUrl(
                                `Halo Talenta Cipta Karya, saya ingin bertanya tentang kelas ${program.judul} (${jadwalLabel}, ${jamLabel}). Apakah jadwal ini masih tersedia dan bagaimana cara mendaftarnya?`
                              ),
                            }}
                            disabled={kursi?.penuh ?? false}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
              <p className="mt-3 text-sm text-mist">
                Kuota tiap batch terbatas — amankan kursimu sekarang. Belum
                yakin?{" "}
                <a
                  href={waUrl(
                    `Halo Talenta Cipta Karya, saya ingin bertanya tentang program ${program.judul}.`
                  )}
                  target="_blank"
                  rel="noopener"
                  className="font-semibold text-blue hover:underline"
                >
                  Tanya via WhatsApp
                </a>
              </p>
            </>
          ) : (
            <p className="text-mist">
              Belum ada jadwal untuk program ini — hubungi kami untuk jadwal
              terbaru.
            </p>
          )}
        </section>

        {/* Program lain di kategori yang sama */}
        {relatedPrograms.length > 0 && (
          <section aria-labelledby="related-heading" className="mb-4">
            <h2
              id="related-heading"
              className="font-display text-2xl font-semibold text-navy mb-6"
            >
              Program lain di kategori ini
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPrograms.map((p) => (
                <Link
                  key={p.id}
                  href={`/program/${p.slug}`}
                  className="rounded-2xl bg-white border border-line p-6 space-y-3 hover:border-gold hover:shadow-lg transition"
                >
                  <h3 className="font-display text-lg font-semibold text-navy">
                    {p.judul}
                  </h3>
                  <p className="text-sm text-mist line-clamp-3">{p.deskripsi}</p>
                  <span className="inline-flex items-center text-sm font-semibold text-gold">
                    Selengkapnya →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
