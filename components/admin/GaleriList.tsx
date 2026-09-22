"use client";

import Image from "next/image";
import { deleteGalleryImage } from "@/app/admin/actions";

export type AdminGalleryItem = {
  id: number;
  url: string;
  caption: string;
  alt?: string | null;
  category: { id: number; name: string } | null;
};

/** Daftar foto di dashboard — hapus dari storage + DB tanpa deploy. */
export default function GaleriList({ items }: { items: AdminGalleryItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-mist">Belum ada foto di galeri.</p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl bg-white border border-line overflow-hidden"
        >
          <div className="relative aspect-[4/3] bg-line">
            <Image
              src={item.url}
              alt={item.alt || item.caption}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
          <div className="p-4 space-y-2">
            <p className="text-sm font-bold text-navy line-clamp-2">
              {item.caption}
            </p>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-block rounded-full bg-paper text-blue text-xs font-bold px-2.5 py-1">
                {item.category?.name ?? "—"}
              </span>
              <form
                action={deleteGalleryImage}
                onSubmit={(e) => {
                  if (!confirm(`Hapus foto "${item.caption}"?`)) e.preventDefault();
                }}
              >
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}