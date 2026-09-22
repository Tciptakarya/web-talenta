"use client";

import { useActionState } from "react";
import {
  createCategory,
  updateCategory,
  deleteCategoryAction,
  type ActionState,
} from "@/app/admin/actions";

export type AdminCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
};

function CategoryRow({ category }: { category: AdminCategory }) {
  const [state, action, pending] = useActionState<ActionState | undefined, FormData>(
    updateCategory,
    undefined
  );

  return (
    <form
      action={action}
      className="rounded-2xl bg-white border border-line p-5 space-y-3"
    >
      <input type="hidden" name="id" value={category.id} />

      <div className="flex items-center gap-3">
        <span className="font-display text-sm font-semibold text-line">
          {String(category.slug)}
        </span>
        <input
          name="name"
          defaultValue={category.name}
          required
          minLength={2}
          maxLength={80}
          className="flex-1 rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-blue"
        />
      </div>

      <textarea
        name="description"
        defaultValue={category.description ?? ""}
        rows={2}
        maxLength={400}
        placeholder="Deskripsi singkat (opsional)"
        className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue"
      />

      <input
        name="image"
        type="url"
        defaultValue={category.image ?? ""}
        maxLength={500}
        placeholder="URL gambar kategori (opsional)"
        className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue"
      />

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={category.isActive}
            className="rounded border-line"
          />
          <span className="font-semibold text-navy">Aktif</span>
        </label>

        {/* Delete form - separate form with server action */}
        <form action={deleteCategoryAction}>
          <input type="hidden" name="id" value={category.id} />
          <button
            type="submit"
            onClick={(e) => {
              if (!confirm(`Hapus kategori "${category.name}"?`)) e.preventDefault();
            }}
            className="text-xs font-bold text-red-600 hover:underline"
          >
            Hapus
          </button>
        </form>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-navy text-white font-bold px-5 py-2 text-sm disabled:opacity-70"
        >
          {pending ? "Menyimpan..." : "Simpan"}
        </button>
        {state?.error && (
          <p className="text-sm font-semibold text-red-600">{state.error}</p>
        )}
        {state?.ok && (
          <p className="text-sm font-semibold text-blue">{state.message}</p>
        )}
      </div>
    </form>
  );
}

export default function KategoriManager({ categories }: { categories: AdminCategory[] }) {
  const [createState, createAction, createPending] = useActionState<
    ActionState | undefined,
    FormData
  >(createCategory, undefined);

  return (
    <div className="space-y-6">
      {/* Form Tambah Kategori */}
      <form
        action={createAction}
        className="rounded-2xl bg-white border border-line p-6 space-y-4"
      >
        <h2 className="font-display text-xl font-semibold text-navy">
          Tambah Kategori Baru
        </h2>

        <div>
          <label htmlFor="name" className="block text-xs font-bold text-navy mb-1.5">
            Nama Kategori
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={80}
            placeholder="Contoh: Desain Grafis"
            className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-bold text-navy mb-1.5">
            Deskripsi (opsional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            maxLength={400}
            placeholder="Tagline singkat untuk halaman publik"
            className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-xs font-bold text-navy mb-1.5">
            URL Gambar (opsional)
          </label>
          <input
            id="image"
            name="image"
            type="url"
            maxLength={500}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={true}
              className="rounded border-line"
            />
            <span className="font-semibold text-navy">Aktif (tampil di publik)</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={createPending}
            className="rounded-full bg-navy text-white font-bold px-6 py-3 text-sm hover:-translate-y-0.5 transition disabled:opacity-70"
          >
            {createPending ? "Menambah..." : "Tambah Kategori"}
          </button>
          {createState?.error && (
            <p className="text-sm font-semibold text-red-600">{createState.error}</p>
          )}
          {createState?.ok && (
            <p className="text-sm font-semibold text-blue">{createState.message}</p>
          )}
        </div>
      </form>

      {/* Daftar Kategori */}
      <div className="space-y-4">
        {categories.map((c) => (
          <CategoryRow key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}