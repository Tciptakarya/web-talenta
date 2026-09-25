import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import FormPendaftaran from "@/components/site/FormPendaftaran";
import KuotaBadge from "@/components/site/KuotaBadge";
import { sisaKursi } from "@/lib/data";
import type { UpcomingJadwalRow } from "@/lib/data";

/** Nomor WhatsApp resmi — konsisten dengan Footer/Kontak (0811-9700-322). */
const WA_NUMBER = "628119700322";

function waUrl(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

function DayBadge({ row }: { row: UpcomingJadwalRow }) {
  if (row.tanggal) {
    return (
      <span className="inline-block rounded-full bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-400/30 px-3 py-1 text-xs font-bold whitespace-nowrap">
        {formatTanggalSingkat(row.tanggal)}
      </span>
    );
  }
  if (row.offsetDays === 0) {
    return (
      <span className="inline-block rounded-full bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/30 px-3 py-1 text-xs font-bold whitespace-nowrap">
        Hari ini · {row.hari}
      </span>
    );
  }
  if (row.offsetDays === 1) {
    return (
      <span className="inline-block rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/30 px-3 py-1 text-xs font-bold whitespace-nowrap">
        Besok · {row.hari}
      </span>
    );
  }
  return (
    <span className="inline-block rounded-full bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-400/30 px-3 py-1 text-xs font-bold whitespace-nowrap">
      Setiap {row.hari}
    </span>
  );
}

/** "2026-09-30" → "Senin, 30 Sep 2026" — parsing manual agar stabil di semua zona. */
function formatTanggalSingkat(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const namaHari = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const namaBulan = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const hari = namaHari[dt.getUTCDay()] ?? "";
  const bln = namaBulan[(m ?? 1) - 1] ?? "";
  return `${hari}, ${d} ${bln} ${y}`;
}

/** Label ringkas untuk pesan WhatsApp & badge: tanggal eksak bila ada. */
function labelJadwalPublik(j: Pick<UpcomingJadwalRow, "hari" | "tanggal">): string {
  if (j.tanggal) return formatTanggalSingkat(j.tanggal);
  return `Setiap ${j.hari}`;
}

/**
 * Section landing "Jadwal Kelas Terdekat" — server component.
 * Menampilkan 5–8 jadwal aktif paling dekat + CTA WhatsApp (pesan otomatis
 * menyebut program & jadwal) + link "Lihat semua kelas" ke /kelas.
 */
export default function JadwalTerdekat({
  items,
}: {
  items: UpcomingJadwalRow[];
}) {
  if (items.length === 0) return null;

  // Kolom kuota hanya tampil bila minimal satu jadwal punya batas kapasitas.
  const adaKuota = items.some((j) => j.kuota !== null);

  return (
    <section className="section" id="jadwal-terdekat">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="kicker">Jadwal Kelas Terdekat</span>
          <h2>Kelas berikutnya sudah menunggu jadwalmu</h2>
          <p className="mt-3 text-mist">
            Lihat jadwal pelatihan yang akan datang, lalu klik <strong>Daftar</strong>{" "}
            pada baris yang kamu pilih — kuota tiap batch terbatas. Masih ada
            pertanyaan? Hubungi kami lewat WhatsApp.
          </p>
        </Reveal>

        <Reveal className="rounded-2xl bg-white border border-line overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line text-xs font-bold text-navy">
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Hari</th>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3 hidden md:table-cell">Instruktur</th>
                <th className="px-4 py-3 hidden md:table-cell">Ruangan</th>
                {adaKuota && (
                  <th className="px-4 py-3 hidden sm:table-cell">Kuota</th>
                )}
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((j) => {
                const detailHref = j.program.categorySlug
                  ? `/kelas/${j.program.categorySlug}`
                  : "/kelas";
                const tanyaUrl = waUrl(
                  `Halo Talenta Cipta Karya, saya ingin bertanya tentang kelas ${j.program.judul} (${labelJadwalPublik(j)}, ${j.jamMulai}-${j.jamAkhir} WIB). Apakah jadwal ini masih tersedia dan bagaimana cara mendaftarnya?`
                );
                const kursi = sisaKursi(j);
                return (
                  <tr key={j.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 text-sm font-bold text-navy">
                      {j.program.judul}
                    </td>
                    <td className="px-4 py-3">
                      <DayBadge row={j} />
                    </td>
                    <td className="px-4 py-3 text-sm text-ink whitespace-nowrap">
                      {j.jamMulai} - {j.jamAkhir} WIB
                    </td>
                    <td className="px-4 py-3 text-sm text-ink hidden md:table-cell">
                      {j.instruktur ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink hidden md:table-cell">
                      {j.ruangan ?? "—"}
                    </td>
                    {adaKuota && (
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {kursi ? (
                          <KuotaBadge kursi={kursi} />
                        ) : (
                          <span className="text-sm text-mist">—</span>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex flex-wrap items-center justify-end gap-3">
                        <Link
                          href={detailHref}
                          className="text-sm font-bold text-gold hover:underline"
                        >
                          Detail
                        </Link>
                        <FormPendaftaran
                          target={{
                            jadwalId: j.id,
                            programJudul: j.program.judul,
                            jadwalLabel: labelJadwalPublik(j),
                            jamLabel: `${j.jamMulai} - ${j.jamAkhir} WIB`,
                            ruangan: j.ruangan,
                            waUrl: tanyaUrl,
                          }}
                          disabled={kursi?.penuh ?? false}
                        />
                        <a
                          href={tanyaUrl}
                          target="_blank"
                          rel="noopener"
                          className="text-sm font-bold text-navy hover:text-gold hover:underline"
                        >
                          Tanya WA
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Reveal>

        <Reveal className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={waUrl(
              "Halo Talenta Cipta Karya, saya ingin tahu jadwal kelas terdekat dan cara mendaftar."
            )}
            target="_blank"
            rel="noopener"
            className="btn btn-primary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 11.5a8.5 8.5 0 1 1-3.8-7.1" />
              <path d="M21 11.5c0 4.7-3.8 8.5-8.5 8.5a8.6 8.6 0 0 1-4.3-1.1L3 20l1.2-5A8.5 8.5 0 0 1 21 11.5z" />
            </svg>
            Tanya Jadwal via WhatsApp
          </a>
          <Link href="/kelas" className="btn btn-ghost">
            Lihat semua kelas →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}