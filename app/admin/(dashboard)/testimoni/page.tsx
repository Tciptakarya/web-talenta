import { prisma } from "@/lib/prisma";
import TestimoniManager from "@/components/admin/TestimoniManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Testimoni — Admin" };

export default async function TestimoniPage() {
  const items = await prisma.testimonial
    .findMany({ orderBy: { urutan: "asc" } })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">
          Kelola Testimoni
        </h1>
        <p className="text-sm text-mist mt-1">
          Tambah, edit, atau hapus testimoni — tanpa edit kode.
        </p>
      </div>
      <TestimoniManager items={items} />
    </div>
  );
}
