"use client";

import { useActionState } from "react";
import {
  createProgram,
  updateProgram,
  deleteProgramAction,
  type ActionState,
} from "@/app/admin/actions";

export type AdminProgram = {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  urutan: number;
  isActive: boolean;
  categoryId: number | null;
  category: { id: number; name: string } | null;
};

export type AdminCategory = {
  id: number;
  name: string;
};

function ProgramRow({
  program,
  categories,
}: {
  program: AdminProgram;
  categories: AdminCategory[];
}) {
  const [state, action, pending] = useActionState<ActionState | undefined, FormData>(
    updateProgram,
    undefined
  );

  return (
    <form
      action={action}
      className="rounded-2xl bg-white border border-line p-5 space-y-3"
    >
      <input type="hidden" name="id" value={program.id} />

      <div className="flex items-center gap-3">
        <span className="font-display text-sm font-semibold text-line">
          {String(program.urutan).padStart(2, "0")}
        </span>
        <input
          name="judul"
          defaultValue={program.judul}
          required
          minLength={2}
          maxLength={80}
          className="flex-1 rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-blue"
        />
      </div>

      <textarea
        name="deskripsi"
        defaultValue={program.deskripsi}
        rows={2}
        required
        minLength={10}
        maxLength={600}
        className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue"
      />

      <div>
        <label htmlFor={`categoryId-${program.id}`} className="block text-xs font-bold text-navy mb-1.5">
          Kategori
        </label>
        <select
          id={`categoryId-${program.id}`}
          name="categoryId"
          required
          className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id} selected={program.categoryId === c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={program.isActive}
            className="rounded border-line"
          />
          <span className="font-semibold text-navy">Aktif (tampil di publik)</span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-navy">Urutan</span>
          <input
            name="urutan"
            type="number"
            defaultValue={program.urutan}
            min={0}
            max={999}
            className="w-20 rounded-xl border-[1.5px] border-line bg-paper px-3 py-1.5 text-sm text-center focus:outline-none focus:border-blue"
          />
        </label>
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

      {/* Delete form - separate form with server action */}
      <form action={deleteProgramAction}>
        <input type="hidden" name="id" value={program.id} />
        <button
          type="submit"
          onClick={(e) => {
            if (!confirm(`Hapus program "${program.judul}"?`)) e.preventDefault();
          }}
          className="text-xs font-bold text-red-600 hover:underline"
        >
          Hapus
        </button>
      </form>
    </form>
  );
}

export default function ProgramManager({
  programs,
  categories,
}: {
  programs: AdminProgram[];
  categories: AdminCategory[];
}) {
  const [createState, createAction, createPending] = useActionState<
    ActionState | undefined,
    FormData
  >(createProgram, undefined);

  return (
    <div className="space-y-6">
      {/* Form Tambah Program */}
      <form
        action={createAction}
        className="rounded-2xl bg-white border border-line p-6 space-y-4"
      >
        <h2 className="font-display text-xl font-semibold text-navy">
          Tambah Program Baru
        </h2>

        <div>
          <label htmlFor="judul" className="block text-xs font-bold text-navy mb-1.5">
            Nama Program
          </label>
          <input
            id="judul"
            name="judul"
            type="text"
            required
            minLength={2}
            maxLength={80}
            placeholder="Contoh: Pelatihan Desain Grafis"
            className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue"
          />
        </div>

        <div>
          <label htmlFor="deskripsi" className="block text-xs font-bold text-navy mb-1.5">
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            rows={2}
            required
            minLength={10}
            maxLength={600}
            placeholder="Deskripsi program..."
            className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-xs font-bold text-navy mb-1.5">
            Kategori (wajib)
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue"
          >
            <option value="">— Pilih Kategori —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={true}
              className="rounded border-line"
            />
            <span className="font-semibold text-navy">Aktif (tampil di publik)</span>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-navy">Urutan</span>
            <input
              name="urutan"
              type="number"
              defaultValue={0}
              min={0}
              max={999}
              className="w-20 rounded-xl border-[1.5px] border-line bg-paper px-3 py-1.5 text-sm text-center focus:outline-none focus:border-blue"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={createPending}
            className="rounded-full bg-navy text-white font-bold px-6 py-3 text-sm hover:-translate-y-0.5 transition disabled:opacity-70"
          >
            {createPending ? "Menambah..." : "Tambah Program"}
          </button>
          {createState?.error && (
            <p className="text-sm font-semibold text-red-600">{createState.error}</p>
          )}
          {createState?.ok && (
            <p className="text-sm font-semibold text-blue">{createState.message}</p>
          )}
        </div>
      </form>

      {/* Daftar Program */}
      <div className="space-y-4">
        {programs.map((p) => (
          <ProgramRow key={p.id} program={p} categories={categories} />
        ))}
      </div>
    </div>
  );
}