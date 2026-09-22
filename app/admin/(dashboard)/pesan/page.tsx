import { prisma } from "@/lib/prisma";
import PesanList from "@/components/admin/PesanList";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pesan Masuk — Admin" };

export default async function PesanPage() {
  const messages = await prisma.contactMessage
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">
          Pesan Masuk
        </h1>
        <p className="text-sm text-mist mt-1">
          Semua pesan form kontak tersimpan di sini — cadangan bila email
          notifikasi tidak sampai.
        </p>
      </div>
      <PesanList messages={messages} />
    </div>
  );
}
