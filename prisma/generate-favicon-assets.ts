/**
 * Generate aset favicon "navy rounded-square + feather putih" (keputusan user,
 * 2026-10-02). Dipakai sekali; hasilnya ikut ter-commit.
 *
 * Sumber artwork: assets/favicon-feather.png (feather biru + goresan, transparan).
 * Dijalankan manual:  npx tsx prisma/generate-favicon-assets.ts
 * (butuh sharp, sudah jadi dependensi project).
 *
 * Output:
 *   public/favicon.png        512  tab browser modern
 *   app/icon.png             512  (konvensi Next.js -> /icon.png)
 *   public/apple-touch-icon.png  180  full-bleed (iOS yang memotong sudutnya)
 *   app/favicon.ico           16/32/48/256  untuk mesin pencari
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const NAVY = "#16214A";
const RADIUS = 112; // ~22% dari 512
const INNER = 356; // ukuran artwork di dalam kotak
const CANVAS = 512;

async function whiteSilhouette(src: Buffer, size: number) {
  // Kanal alpha dijadikan kanal alpha sungguhan.
  //
  // PENTING: `extractChannel(3)` mengembalikan gambar grayscale 1 kanal —
  // nilainya ada di channel abu-abu, BUKAN di alpha. Kalau langsung dipakai
  // dengan blend `dest-in`, hasilnya kotak putih solid (alpha always opaque).
  // Jadi alpha diambil sebagai data mentah lalu disusun ulang jadi RGBA putih.
  const { data } = await sharp(src)
    .resize(size, size, { fit: "contain" })
    .ensureAlpha()
    .extractChannel(3)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = size * size;
  const rgba = Buffer.alloc(px * 4);
  for (let i = 0; i < px; i++) {
    rgba[i * 4] = 255;
    rgba[i * 4 + 1] = 255;
    rgba[i * 4 + 2] = 255;
    rgba[i * 4 + 3] = data[i];
  }
  return sharp(rgba, { raw: { width: size, height: size, channels: 4 } }).png().toBuffer();
}

function roundedSquare(size: number, radius: number, fill: string) {
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
       <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${fill}"/>
     </svg>`
  );
}

async function composeIcon(opts: {
  size: number;
  radius: number | null; // null = full-bleed (untuk apple-touch-icon)
  inner: number;
  feather: Buffer;
}) {
  const bg =
    opts.radius === null
      ? Buffer.from(
          `<svg width="${opts.size}" height="${opts.size}" xmlns="http://www.w3.org/2000/svg">
             <rect width="${opts.size}" height="${opts.size}" fill="${NAVY}"/>
           </svg>`
        )
      : roundedSquare(opts.size, opts.radius, NAVY);

  const art = await whiteSilhouette(opts.feather, opts.inner);
  const left = Math.round((opts.size - opts.inner) / 2);
  const top = Math.round((opts.size - opts.inner) / 2);

  return sharp({
    create: { width: opts.size, height: opts.size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: bg, top: 0, left: 0 },
      { input: art, top, left },
    ])
    .png()
    .toBuffer();
}

async function writeIco(png512: Buffer, dest: string) {
  const SIZES = [16, 32, 48, 256];
  const entries: { size: number; len: number; offset: number }[] = [];
  const chunks: Buffer[] = [];
  let offset = 6 + SIZES.length * 16;
  for (const size of SIZES) {
    const png = await sharp(png512).resize(size, size).png().toBuffer();
    entries.push({ size, len: png.length, offset });
    chunks.push(png);
    offset += png.length;
  }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(SIZES.length, 4);
  const dir = Buffer.alloc(SIZES.length * 16);
  entries.forEach((e, i) => {
    const o = i * 16;
    const dim = e.size === 256 ? 0 : e.size;
    dir.writeUInt8(dim, o);
    dir.writeUInt8(dim, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(e.len, o + 8);
    dir.writeUInt32LE(e.offset, o + 12);
  });
  fs.writeFileSync(dest, Buffer.concat([header, dir, ...chunks]));
}

async function main() {
  const root = process.cwd();
  const src = path.join(root, "assets", "favicon-feather.png");
  const feather = fs.readFileSync(src);

  const square512 = await composeIcon({ size: CANVAS, radius: RADIUS, inner: INNER, feather });

  fs.writeFileSync(path.join(root, "public", "favicon.png"), square512);
  fs.writeFileSync(path.join(root, "app", "icon.png"), square512);
  console.log("public/favicon.png + app/icon.png :", (square512.length / 1024).toFixed(1), "KB");

  // Apple: full-bleed, iOS sendiri yang memotong sudutnya.
  const apple = await composeIcon({ size: 180, radius: null, inner: 132, feather });
  fs.writeFileSync(path.join(root, "public", "apple-touch-icon.png"), apple);
  console.log("public/apple-touch-icon.png       :", (apple.length / 1024).toFixed(1), "KB");

  await writeIco(square512, path.join(root, "app", "favicon.ico"));
  console.log("app/favicon.ico                   :", (fs.statSync(path.join(root, "app", "favicon.ico")).size / 1024).toFixed(1), "KB");

  // Pratinjau: 16/32/48 lalu diperbesar 8x (negar) + versi 512.
  const parts = [];
  let x = 0;
  for (const s of [16, 32, 48]) {
    const up = await sharp(square512)
      .resize(s, s)
      .resize(s * 7, s * 7, { kernel: "nearest" })
      .png()
      .toBuffer();
    parts.push({ input: up, left: x, top: 0 });
    x += s * 7 + 28;
  }
  const big = await sharp(square512).resize(240, 240).png().toBuffer();
  parts.push({ input: big, left: x, top: 0 });
  await sharp({ create: { width: x + 260, height: 340, channels: 4, background: "#2b2f38" } })
    .composite(parts)
    .png()
    .toFile("C:/Users/user/AppData/Local/Temp/opencode/favicon-preview2.png");
  console.log("pratinjau: C:/Users/user/AppData/Local/Temp/opencode/favicon-preview2.png");
}

main().catch((e) => {
  console.error("GAGAL:", e.message);
  process.exit(1);
});