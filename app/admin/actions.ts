"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removeImage } from "@/lib/storage";
import {
  categorySchema,
  programSchema,
  testimonialSchema,
  gantiPasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/schemas";
import { slugify, uniqueSlug } from "@/lib/slug";
import { generateResetToken, hashToken } from "@/lib/passwordReset";
import { sendPasswordResetEmail, siteUrl } from "@/lib/resend";
import { isRateLimited } from "@/lib/rateLimit";
import { headers } from "next/headers";

export type ActionState = {
  ok: boolean;
  error?: string;
  message?: string;
};

/** Semua mutasi dashboard wajib lewat session login admin. */
async function requireAdmin() {
  const session = await auth();
  if (!session) {
    throw new Error("Tidak terautentikasi. Silakan login kembali.");
  }
  return session;
}

function refresh() {
  // Bersihkan cache router supaya perubahan langsung terlihat di situs publik
  revalidatePath("/", "layout");
}

/* ---------------------------------- Testimoni --------------------------------- */

export async function createTestimonial(
  _prev: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin();
    const parsed = testimonialSchema.safeParse({
      nama: formData.get("nama"),
      peran: formData.get("peran"),
      pesan: formData.get("pesan"),
      urutan: formData.get("urutan") || 0,
    });
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      };
    }
    await prisma.testimonial.create({ data: parsed.data });
    refresh();
    return { ok: true, message: "Testimoni ditambahkan." };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function updateTestimonial(
  _prev: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin();
    const parsed = testimonialSchema
      .extend({ id: z.coerce.number().int().positive() })
      .safeParse({
        id: formData.get("id"),
        nama: formData.get("nama"),
        peran: formData.get("peran"),
        pesan: formData.get("pesan"),
        urutan: formData.get("urutan") || 0,
      });
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      };
    }
    const { id, ...data } = parsed.data;
    await prisma.testimonial.update({ where: { id }, data });
    refresh();
    return { ok: true, message: "Testimoni diperbarui." };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;
  await prisma.testimonial.delete({ where: { id } }).catch(() => undefined);
  refresh();
}

/* ---------------------------------- Kategori ----------------------------------- */

/** Ambil kategori + pastikan slug unik (otomatis dari name, §17). */
async function categorySlugData(
  name: string,
  excludeId?: number
): Promise<string> {
  const root = slugify(name) || "kategori";
  let slug = root;
  let i = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    const owner = await prisma.category.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (excludeId && owner?.id === excludeId) break; // slug milik record ini
    i += 1;
    slug = `${root}-${i}`;
  }
  return slug;
}

function parseCategory(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
    image: formData.get("image") || "",
    isActive: formData.get("isActive") === "on",
  });
}

export async function createCategory(
  _prev: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin();
    const parsed = parseCategory(formData);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      };
    }
    const { name, description, image, isActive } = parsed.data;

    // Validasi §10: nama tidak boleh duplikat (case-insensitive)
    const allCats = await prisma.category.findMany({ select: { id: true, name: true } });
    const dup = allCats.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (dup) {
      return { ok: false, error: `Kategori "${name}" sudah ada.` };
    }

    const slug = await categorySlugData(name);
    await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        isActive,
      },
    });
    refresh();
    return { ok: true, message: `Kategori "${name}" ditambahkan.` };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function updateCategory(
  _prev: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin();
    const parsed = parseCategory(formData);
    const id = Number(formData.get("id"));
    if (!parsed.success || !Number.isFinite(id)) {
      return {
        ok: false,
        error: parsed.success
          ? "Data tidak valid."
          : parsed.error.issues[0]?.message ?? "Data tidak valid.",
      };
    }
    const { name, description, image, isActive } = parsed.data;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "Kategori tidak ditemukan." };

    const allCats = await prisma.category.findMany({ select: { id: true, name: true } });
    const dup = allCats.find((c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== id);
    if (dup) {
      return { ok: false, error: `Kategori "${name}" sudah ada.` };
    }

    // Slug mengikuti nama bila berubah — tetap unik
    const slug =
      slugify(name) === slugify(existing.name)
        ? existing.slug
        : await categorySlugData(name, id);

    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        isActive,
      },
    });
    refresh();
    return { ok: true, message: `Kategori "${name}" disimpan.` };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

// Overload untuk mendukung penggunaan langsung di form action (hanya FormData)
export async function deleteCategory(formData: FormData): Promise<ActionState>;
// Overload untuk useActionState
export async function deleteCategory(
  _prev: ActionState | undefined,
  formData: FormData
): Promise<ActionState>;
export async function deleteCategory(
  _prev: ActionState | undefined | FormData,
  formData?: FormData
): Promise<ActionState> {
  // Handle both signatures: (formData) or (_prev, formData)
  const fd = formData ?? (_prev instanceof FormData ? _prev : undefined);
  if (!fd) return { ok: false, error: "Data tidak valid." };
  try {
    await requireAdmin();
    const id = Number(fd.get("id"));
    if (!Number.isFinite(id)) {
      return { ok: false, error: "Data tidak valid." };
    }
    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { programs: true, galleryImages: true } } },
    });
    if (!existing) return { ok: false, error: "Kategori tidak ditemukan." };

    // Validasi §10: kategori yang masih dipakai tidak boleh dihapus
    const used =
      existing._count.programs + existing._count.galleryImages;
    if (used > 0) {
      return {
        ok: false,
        error:
          `Kategori "${existing.name}" masih dipakai ` +
          `(${existing._count.programs} program, ` +
          `${existing._count.galleryImages} foto). ` +
          `Alihkan data ke kategori lain atau nonaktifkan kategorinya.`,
      };
    }

    await prisma.category.delete({ where: { id } });
    refresh();
    return { ok: true, message: `Kategori "${existing.name}" dihapus.` };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/* ------------------------------------ Program ---------------------------------- */

export async function createProgram(
  _prev: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin();
    const parsed = programSchema.safeParse({
      judul: formData.get("judul"),
      deskripsi: formData.get("deskripsi"),
      categoryId: formData.get("categoryId"),
      isActive: formData.get("isActive") === "on",
      urutan: formData.get("urutan") || 0,
    });
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      };
    }
    const { judul, deskripsi, categoryId, isActive, urutan } = parsed.data;

    // Kategori harus ada (relasi ke Category, bukan string)
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return { ok: false, error: "Kategori tidak ditemukan." };
    }

    // Slug unik dari judul
    const root = slugify(judul) || "program";
    let slug = root;
    let i = 1;
    while (await prisma.program.findUnique({ where: { slug } })) {
      i += 1;
      slug = `${root}-${i}`;
    }

    await prisma.program.create({
      data: { judul, deskripsi, slug, categoryId, isActive, urutan },
    });
    refresh();
    return { ok: true, message: `Program "${judul}" ditambahkan.` };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function updateProgram(
  _prev: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin();
    const parsed = programSchema.safeParse({
      judul: formData.get("judul"),
      deskripsi: formData.get("deskripsi"),
      categoryId: formData.get("categoryId"),
      isActive: formData.get("isActive") === "on",
      urutan: formData.get("urutan") || 0,
    });
    const id = Number(formData.get("id"));
    if (!parsed.success || !Number.isFinite(id)) {
      return {
        ok: false,
        error: parsed.success
          ? "Data tidak valid."
          : parsed.error.issues[0]?.message ?? "Data tidak valid.",
      };
    }
    const { judul, deskripsi, categoryId, isActive, urutan } = parsed.data;

    const existing = await prisma.program.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "Program tidak ditemukan." };

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return { ok: false, error: "Kategori tidak ditemukan." };
    }

    await prisma.program.update({
      where: { id },
      data: { judul, deskripsi, categoryId, isActive, urutan },
    });
    refresh();
    return { ok: true, message: `Program "${judul}" disimpan.` };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

// Overload untuk mendukung penggunaan langsung di form action (hanya FormData)
export async function deleteProgram(formData: FormData): Promise<ActionState>;
// Overload untuk useActionState
export async function deleteProgram(
  _prev: ActionState | undefined,
  formData: FormData
): Promise<ActionState>;
export async function deleteProgram(
  _prev: ActionState | undefined | FormData,
  formData?: FormData
): Promise<ActionState> {
  // Handle both signatures: (formData) or (_prev, formData)
  const fd = formData ?? (_prev instanceof FormData ? _prev : undefined);
  if (!fd) return { ok: false, error: "Data tidak valid." };
  try {
    await requireAdmin();
    const id = Number(fd.get("id"));
    if (!Number.isFinite(id)) {
      return { ok: false, error: "Data tidak valid." };
    }
    const existing = await prisma.program.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "Program tidak ditemukan." };
    await prisma.program.delete({ where: { id } });
    refresh();
    return { ok: true, message: `Program "${existing.judul}" dihapus.` };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/* ------------------------------------ Galeri ----------------------------------- */

export async function deleteGalleryImage(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) return;
  await removeImage(image.url); // hapus dari Blob / folder uploads
  await prisma.galleryImage.delete({ where: { id } }).catch(() => undefined);
  refresh();
}

/* ---------------------------------- Pesan masuk --------------------------------- */

export async function deleteContactMessage(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;
  await prisma.contactMessage.delete({ where: { id } }).catch(() => undefined);
  refresh();
}

/* ------------------------------------ Akun admin ----------------------------------- */

/**
 * Ganti password akun admin yang sedang login.
 * Penting untuk produksi: hosting managed (Hostinger Web Apps) tidak punya
 * akses shell, jadi password harus bisa diganti dari dalam dashboard —
 * tidak ada cara menjalankan script manual di server.
 */
export async function gantiPassword(
  _prev: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await requireAdmin();
    const parsed = gantiPasswordSchema.safeParse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      };
    }

    const email = session.user?.email;
    if (!email) {
      return { ok: false, error: "Sesi admin tidak valid. Silakan login ulang." };
    }

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) return { ok: false, error: "Akun admin tidak ditemukan." };

    const valid = await bcrypt.compare(
      parsed.data.currentPassword,
      user.passwordHash
    );
    if (!valid) return { ok: false, error: "Password lama salah." };

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash },
    });
    return { ok: true, message: "Password berhasil diganti." };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/* ------------------------------------ Lupa password ----------------------------------- */

const GENERIC_FORGOT_MSG =
  "Jika email tersebut terdaftar, kami telah mengirimkan link untuk mengatur ulang password.";

function getClientIp(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return h.get("x-real-ip") || "unknown";
}

/**
 * Request link reset — response generik untuk cegah enumerasi (§5).
 * Rate limit: 5/IP/15m dan 3/email/jam.
 */
export async function requestPasswordReset(
  _prev: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  try {
    const h = await headers();
    const ip = getClientIp(h);

    if (isRateLimited(`forgot:ip:${ip}`, 5, 15 * 60 * 1000)) {
      return {
        ok: true,
        message: GENERIC_FORGOT_MSG,
      };
    }

    const parsed = forgotPasswordSchema.safeParse({
      email: String(formData.get("email") ?? "").trim(),
    });
    if (!parsed.success) {
      // Tetap generik — jangan bocorkan validasi email
      return { ok: true, message: GENERIC_FORGOT_MSG };
    }

    const emailRaw = parsed.data.email.trim();
    const emailNorm = emailRaw.toLowerCase();

    if (isRateLimited(`forgot:email:${emailNorm}`, 3, 60 * 60 * 1000)) {
      return { ok: true, message: GENERIC_FORGOT_MSG };
    }

    // Cari akun — case-insensitive (SQLite default sensitif)
    const allUsers = await prisma.adminUser.findMany();
    const resolved = allUsers.find((u) => u.email.toLowerCase() === emailNorm);
    if (!resolved) {
      return { ok: true, message: GENERIC_FORGOT_MSG };
    }

    // Hapus token kadaluarsa/terpakai lama (housekeeping ringan)
    await prisma.passwordResetToken
      .deleteMany({
        where: {
          adminUserId: resolved.id,
          OR: [{ expiresAt: { lt: new Date() } }, { usedAt: { not: null } }],
        },
      })
      .catch(() => undefined);

    const { raw, hash } = generateResetToken();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        adminUserId: resolved.id,
        tokenHash: hash,
        expiresAt,
      },
    });

    const resetUrl = `${siteUrl()}/admin/reset-password?token=${encodeURIComponent(raw)}`;
    // Kirim email — kegagalan tidak dibocorkan ke user (tetap generik)
    await sendPasswordResetEmail({ to: resolved.email, resetUrl }).catch(() => undefined);

    // Log fallback bila RESEND_API_KEY belum diisi (permudah testing lokal)
    if (!process.env.RESEND_API_KEY) {
      console.info(`[password-reset] Link untuk ${resolved.email}: ${resetUrl}`);
    }

    return { ok: true, message: GENERIC_FORGOT_MSG };
  } catch (err) {
    console.error("[requestPasswordReset]", err);
    return { ok: true, message: GENERIC_FORGOT_MSG };
  }
}

/**
 * Reset password via token — sekali pakai, 30 menit (§11-§14).
 */
export async function resetPassword(
  _prev: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  try {
    const parsed = resetPasswordSchema.safeParse({
      token: String(formData.get("token") ?? ""),
      newPassword: String(formData.get("newPassword") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      };
    }

    const { token: raw, newPassword } = parsed.data;
    const hash = hashToken(raw);

    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hash },
      include: { adminUser: true },
    });

    if (!record || record.usedAt || record.expiresAt.getTime() <= Date.now()) {
      return {
        ok: false,
        error: "Link reset password tidak valid atau sudah kedaluwarsa.",
      };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.adminUser.update({
        where: { id: record.adminUserId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    // Invalidate token lain yang masih aktif untuk user yang sama (opsional hardening)
    await prisma.passwordResetToken
      .updateMany({
        where: {
          adminUserId: record.adminUserId,
          usedAt: null,
          id: { not: record.id },
        },
        data: { usedAt: new Date() },
      })
      .catch(() => undefined);

    return {
      ok: true,
      message: "Password berhasil diubah. Silakan login dengan password baru.",
    };
  } catch (err) {
    console.error("[resetPassword]", err);
    return {
      ok: false,
      error: "Link reset password tidak valid atau sudah kedaluwarsa.",
    };
  }
}

/* ------------------------------------ Wrapper untuk form action langsung ----------------------------------- */
/* Wrapper yang return void agar bisa dipakai langsung di form action */

export async function deleteCategoryAction(formData: FormData) {
  await deleteCategory(undefined, formData);
}

export async function deleteProgramAction(formData: FormData) {
  await deleteProgram(undefined, formData);
}
