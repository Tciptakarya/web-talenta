import { renderInline } from "@/lib/siteContent";

/**
 * Render teks yang berasal dari Admin > Tampilan Website.
 *
 * Teks SELALU di-escape dulu oleh `renderInline()`, baru penanda
 * `**tebal**` / `*miring*` diubah menjadi tag. Jadi admin tidak pernah bisa
 * menyuntikkan HTML atau skrip apa pun, meski menempel kode ke kolom teks.
 */
export default function Rich({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: renderInline(text) }}
    />
  );
}
