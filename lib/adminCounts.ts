import { prisma } from "@/lib/prisma";

/**
 * Angka untuk badge di sidebar admin — **sumber tunggal** supaya layout dan
 * halaman Email Center tidak menghitung ulang sendiri (dan tidak berbeda).
 *
 * Semua query punya `.catch(() => 0)` seperti sebelumnya: badge tidak boleh
 * menggagalkan halaman admin.
 */
export type AdminCounts = {
  pesan: number;
  foto: number;
  pendaftaranBaru: number;
  unreadEmail: number;
};

export async function adminNavCounts(): Promise<AdminCounts> {
  const [pesan, foto, pendaftaranBaru, unreadEmail] = await Promise.all([
    prisma.contactMessage.count().catch(() => 0),
    prisma.galleryImage.count().catch(() => 0),
    prisma.pendaftaran.count({ where: { status: "baru" } }).catch(() => 0),
    prisma.emailMessage
      .count({ where: { direction: "inbound", isRead: false, deletedAt: null } })
      .catch(() => 0),
  ]);
  return { pesan, foto, pendaftaranBaru, unreadEmail };
}
