"use client";

import { useState, useActionState } from "react";
import {
  createJadwal,
  updateJadwal,
  deleteJadwal,
  type ActionState,
} from "@/app/admin/actions";
import { HARI_LIST } from "@/lib/schemas";

export type ProgramOption = { id: number; judul: string };

export type AdminJadwal = {
  id: number;
  programId: number;
  instruktur: string | null;
  ruangan: string | null;
  hari: string;
  tanggal: string | null; // "YYYY-MM-DD" — null = jadwal mingguan lama
  jamMulai: string;
  jamAkhir: string;
  urutan: number;
  isActive: boolean;
  program: { id: number; judul: string };
};

const inputCls =
  "w-full rounded-xl border-[1.5px] border-line bg-paper px-3 py-2 text-sm focus:outline-none focus:border-blue";
const labelCls = "block text-xs font-bold text-navy mb-1.5";

/** "YYYY-MM-DD" → "30 Sep 2026"; parsing manual agar tak bergeser zona waktu. */
function formatTanggalYmd(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
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
  const bln = namaBulan[(m ?? 1) - 1] ?? "";
  return `${d} ${bln} ${y}`.trim();
}

/** "Senin, 30 Sep 2026"; jadwal lama tanpa tanggal tetap "Setiap Senin". */
function labelJadwal(j: Pick<AdminJadwal, "hari" | "tanggal">): string {
  if (j.tanggal) return `${j.hari}, ${formatTanggalYmd(j.tanggal)}`;
  return `Setiap ${j.hari}`;
}

function ProgramSelect({
  programs,
  defaultValue,
  id,
}: {
  programs: ProgramOption[];
  defaultValue?: number;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        Program
      </label>
      <select
        id={id}
        name="programId"
        required
        defaultValue={defaultValue ?? ""}
        className={inputCls}
      >
        <option value="">— Pilih Program —</option>
        {programs.map((p) => (
          <option key={p.id} value={p.id}>
            {p.judul}
          </option>
        ))}
      </select>
    </div>
  );
}

function HariSelect({
  defaultValue,
  id,
}: {
  defaultValue?: string;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        Hari
      </label>
      <select
        id={id}
        name="hari"
        required
        defaultValue={defaultValue ?? ""}
        className={inputCls}
      >
        <option value="">— Pilih Hari —</option>
        {HARI_LIST.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Input tanggal kalender jadwal satu kali — nama hari diturunkan otomatis di server. */
function TanggalInput({
  defaultValue,
  id,
  required,
}: {
  defaultValue?: string;
  id: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        Tanggal
      </label>
      <input
        id={id}
        name="tanggal"
        type="date"
        required={required}
        defaultValue={defaultValue ?? ""}
        className={inputCls}
      />
    </div>
  );
}

function JadwalEditRow({
  jadwal,
  programs,
  onDone,
}: {
  jadwal: AdminJadwal;
  programs: ProgramOption[];
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState<ActionState | undefined, FormData>(
    updateJadwal,
    undefined
  );

  return (
    <tr>
      <td colSpan={7} className="bg-paper px-4 py-4">
        <form action={action} className="space-y-3">
          <input type="hidden" name="id" value={jadwal.id} />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <ProgramSelect
              id={`edit-program-${jadwal.id}`}
              programs={programs}
              defaultValue={jadwal.programId}
            />
            <div>
              <label htmlFor={`edit-instruktur-${jadwal.id}`} className={labelCls}>
                Instruktur
              </label>
              <input
                id={`edit-instruktur-${jadwal.id}`}
                name="instruktur"
                defaultValue={jadwal.instruktur ?? ""}
                maxLength={80}
                placeholder="Nama instruktur (opsional)"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor={`edit-ruangan-${jadwal.id}`} className={labelCls}>
                Ruangan
              </label>
              <input
                id={`edit-ruangan-${jadwal.id}`}
                name="ruangan"
                defaultValue={jadwal.ruangan ?? ""}
                maxLength={80}
                placeholder="Nama ruangan (opsional)"
                className={inputCls}
              />
            </div>
            <HariSelect id={`edit-hari-${jadwal.id}`} defaultValue={jadwal.hari} />
            {jadwal.tanggal ? (
              <TanggalInput
                id={`edit-tanggal-${jadwal.id}`}
                defaultValue={jadwal.tanggal}
              />
            ) : (
              <div>
                <span className={labelCls}>Tanggal</span>
                <p className="rounded-xl border-[1.5px] border-dashed border-line bg-paper px-3 py-2 text-sm text-mist">
                  Jadwal mingguan lama — tambah tanggal di form baru bila ingin
                  menjadikannya jadwal satu kali.
                </p>
              </div>
            )}
            <div>
              <label htmlFor={`edit-jamMulai-${jadwal.id}`} className={labelCls}>
                Jam Mulai
              </label>
              <input
                id={`edit-jamMulai-${jadwal.id}`}
                name="jamMulai"
                type="time"
                required
                defaultValue={jadwal.jamMulai}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor={`edit-jamAkhir-${jadwal.id}`} className={labelCls}>
                Jam Selesai
              </label>
              <input
                id={`edit-jamAkhir-${jadwal.id}`}
                name="jamAkhir"
                type="time"
                required
                defaultValue={jadwal.jamAkhir}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={jadwal.isActive}
                className="rounded border-line"
              />
              <span className="font-semibold text-navy">Aktif (tampil di publik)</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-navy">Urutan</span>
              <input
                name="urutan"
                type="number"
                defaultValue={jadwal.urutan}
                min={0}
                max={999}
                className="w-20 rounded-xl border-[1.5px] border-line bg-paper px-3 py-1.5 text-sm text-center focus:outline-none focus:border-blue"
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-navy text-white font-bold px-5 py-2 text-sm disabled:opacity-70"
            >
              {pending ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={onDone}
              className="rounded-full border border-line bg-white font-bold px-5 py-2 text-sm text-navy hover:bg-paper"
            >
              Batal
            </button>
            {state?.error && (
              <p className="text-sm font-semibold text-red-600">{state.error}</p>
            )}
            {state?.ok && (
              <p className="text-sm font-semibold text-blue">{state.message}</p>
            )}
          </div>
        </form>
      </td>
    </tr>
  );
}

function JadwalRow({
  jadwal,
  index,
  programs,
}: {
  jadwal: AdminJadwal;
  index: number;
  programs: ProgramOption[];
}) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <tr className="border-b border-line last:border-0 align-top">
        <td className="px-4 py-3 text-sm text-mist">{index}</td>
        <td className="px-4 py-3">
          <p className="text-sm font-bold text-navy">{jadwal.program.judul}</p>
          {!jadwal.isActive && (
            <span className="text-xs font-semibold text-red-600">Nonaktif</span>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-ink">{jadwal.instruktur ?? "—"}</td>
        <td className="px-4 py-3">
          {jadwal.ruangan ? (
            <span className="inline-block rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-400/30 px-3 py-1 text-xs font-bold">
              {jadwal.ruangan}
            </span>
          ) : (
            <span className="text-sm text-mist">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          <span className="inline-block rounded-full bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-400/30 px-3 py-1 text-xs font-bold whitespace-nowrap">
            {labelJadwal(jadwal)}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-ink whitespace-nowrap">
          {jadwal.jamMulai} - {jadwal.jamAkhir} WIB
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="rounded-lg bg-amber-500 hover:bg-amber-600 text-white w-8 h-8 grid place-items-center transition"
              aria-label={`Ubah jadwal ${jadwal.program.judul}`}
            >
              ✏️
            </button>
            <form action={deleteJadwal} className="inline">
              <input type="hidden" name="id" value={jadwal.id} />
              <button
                type="submit"
                onClick={(e) => {
                  if (
                    !confirm(
                      `Hapus jadwal "${jadwal.program.judul}" ${labelJadwal(jadwal)} ${jadwal.jamMulai}-${jadwal.jamAkhir}?`
                    )
                  )
                    e.preventDefault();
                }}
                className="rounded-lg bg-red-500 hover:bg-red-600 text-white w-8 h-8 grid place-items-center transition"
                aria-label={`Hapus jadwal ${jadwal.program.judul}`}
              >
                🗑️
              </button>
            </form>
          </div>
        </td>
      </tr>
      {editing && (
        <JadwalEditRow
          jadwal={jadwal}
          programs={programs}
          onDone={() => setEditing(false)}
        />
      )}
    </>
  );
}

export default function JadwalManager({
  jadwal,
  programs,
}: {
  jadwal: AdminJadwal[];
  programs: ProgramOption[];
}) {
  const [createState, createAction, createPending] = useActionState<
    ActionState | undefined,
    FormData
  >(createJadwal, undefined);

  return (
    <div className="space-y-6">
      {/* Form Tambah Jadwal */}
      <form
        action={createAction}
        className="rounded-2xl bg-white border border-line p-6 space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-navy">
            Tambah Jadwal Baru
          </h2>
          <span className="text-xs text-mist">Format jam: HH:MM (WIB)</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProgramSelect id="new-program" programs={programs} />
          <div>
            <label htmlFor="new-instruktur" className={labelCls}>
              Instruktur
            </label>
            <input
              id="new-instruktur"
              name="instruktur"
              maxLength={80}
              placeholder="Nama instruktur (opsional)"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="new-ruangan" className={labelCls}>
              Ruangan
            </label>
            <input
              id="new-ruangan"
              name="ruangan"
              maxLength={80}
              placeholder="Nama ruangan (opsional)"
              className={inputCls}
            />
          </div>
          <HariSelect id="new-hari" />
          <div>
            <label htmlFor="new-jamMulai" className={labelCls}>
              Jam Mulai
            </label>
            <input
              id="new-jamMulai"
              name="jamMulai"
              type="time"
              required
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="new-jamAkhir" className={labelCls}>
              Jam Selesai
            </label>
            <input
              id="new-jamAkhir"
              name="jamAkhir"
              type="time"
              required
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
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
          <button
            type="submit"
            disabled={createPending}
            className="rounded-full bg-navy text-white font-bold px-6 py-3 text-sm hover:-translate-y-0.5 transition disabled:opacity-70"
          >
            {createPending ? "Menambah..." : "Tambah Jadwal"}
          </button>
          {createState?.error && (
            <p className="text-sm font-semibold text-red-600">{createState.error}</p>
          )}
          {createState?.ok && (
            <p className="text-sm font-semibold text-blue">{createState.message}</p>
          )}
        </div>
      </form>

      {/* Tabel Jadwal */}
      <div className="rounded-2xl bg-white border border-line overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line text-xs font-bold text-navy">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Instruktur</th>
              <th className="px-4 py-3">Ruangan</th>
              <th className="px-4 py-3">Hari / Tanggal</th>
              <th className="px-4 py-3">Waktu</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {jadwal.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-sm text-mist text-center">
                  Belum ada jadwal pelatihan. Tambahkan lewat form di atas.
                </td>
              </tr>
            ) : (
              jadwal.map((j, i) => (
                <JadwalRow key={j.id} jadwal={j} index={i + 1} programs={programs} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
