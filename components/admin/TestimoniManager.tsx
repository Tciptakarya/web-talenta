"use client";

import { useActionState } from "react";
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
  type ActionState,
} from "@/app/admin/actions";

export type AdminTestimonial = {
  id: number;
  nama: string;
  peran: string;
  pesan: string;
  urutan: number;
};

const inputCls =
  "w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue";

function Field({
  label,
  name,
  defaultValue,
  textarea = false,
  required = true,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  textarea?: boolean;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-navy mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          required={required}
          rows={3}
          className={inputCls}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          className={inputCls}
        />
      )}
    </div>
  );
}

function EditRow({ item }: { item: AdminTestimonial }) {
  const [state, action, pending] = useActionState<ActionState | undefined, FormData>(
    updateTestimonial,
    undefined
  );

  return (
    <div className="rounded-2xl bg-white border border-line p-5 space-y-3">
      <form action={action} className="space-y-3">
        <input type="hidden" name="id" value={item.id} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Nama" name="nama" defaultValue={item.nama} />
          <Field label="Peran / Program" name="peran" defaultValue={item.peran} />
        </div>
        <Field label="Pesan" name="pesan" defaultValue={item.pesan} textarea />
        <div className="flex items-center gap-3">
          <div className="w-24">
            <Field
              label="Urutan"
              name="urutan"
              type="number"
              defaultValue={String(item.urutan)}
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-navy text-white font-bold px-5 py-2.5 text-sm disabled:opacity-70"
          >
            {pending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
        {state?.error && (
          <p className="text-sm font-semibold text-red-600">{state.error}</p>
        )}
        {state?.ok && (
          <p className="text-sm font-semibold text-blue">{state.message}</p>
        )}
      </form>

      <form
        action={deleteTestimonial}
        className="flex justify-end"
        onSubmit={(e) => {
          if (!confirm(`Hapus testimoni "${item.nama}"?`)) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={item.id} />
        <button type="submit" className="text-xs font-bold text-red-600 hover:underline">
          Hapus testimoni ini
        </button>
      </form>
    </div>
  );
}

export default function TestimoniManager({
  items,
}: {
  items: AdminTestimonial[];
}) {
  const [createState, createAction, createPending] = useActionState<
    ActionState | undefined,
    FormData
  >(createTestimonial, undefined);

  return (
    <div className="space-y-8">
      <form
        action={createAction}
        className="rounded-2xl bg-white border border-line p-6 space-y-4"
      >
        <h2 className="font-display text-xl font-semibold text-navy">
          Tambah Testimoni
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Nama" name="nama" />
          <Field label="Peran / Program" name="peran" />
          <Field
            label="Urutan"
            name="urutan"
            type="number"
            defaultValue="0"
            required={false}
          />
        </div>
        <Field label="Pesan" name="pesan" textarea />
        <button
          type="submit"
          disabled={createPending}
          className="rounded-full bg-navy text-white font-bold px-6 py-3 text-sm disabled:opacity-70"
        >
          {createPending ? "Menyimpan..." : "Tambah Testimoni"}
        </button>
        {createState?.error && (
          <p className="text-sm font-semibold text-red-600">{createState.error}</p>
        )}
        {createState?.ok && (
          <p className="text-sm font-semibold text-blue">{createState.message}</p>
        )}
      </form>

      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-navy">
          Daftar Testimoni ({items.length})
        </h2>
        {items.length === 0 && <p className="text-sm text-mist">Belum ada testimoni.</p>}
        {items.map((item) => (
          <EditRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
