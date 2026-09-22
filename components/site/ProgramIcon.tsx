// Ikon SVG per program — aspek visual v1 (ikon tidak termasuk konten kelola admin).
type Props = { slug: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ProgramIcon({ slug }: Props) {
  const common = { viewBox: "0 0 24 24", ...stroke };

  switch (slug) {
    case "pelatihan-barista":
      return (
        <svg {...common}>
          <path d="M4 9h13a3 3 0 0 1 0 6h-1" />
          <path d="M4 9v7a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-1" />
          <line x1="7" y1="4" x2="7" y2="7" />
          <line x1="10" y1="3.5" x2="10" y2="7" />
          <line x1="13" y1="4" x2="13" y2="7" />
        </svg>
      );
    case "kursus-komputer":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "bimbingan-belajar":
      return (
        <svg {...common}>
          <path d="M22 10L12 4 2 10l10 6 10-6z" />
          <path d="M6 12.5V17c0 1 2.5 2.5 6 2.5s6-1.5 6-2.5v-4.5" />
        </svg>
      );
    case "digital-marketing":
      return (
        <svg {...common}>
          <path d="M3 11l18-7-4 18-6-8-8-3z" />
        </svg>
      );
    case "pelatihan-k3":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "bosiet":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v12" />
          <path d="M6 12h12" />
        </svg>
      );
    case "basic-safety-training":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12a3 3 0 1 1 6 0" />
          <line x1="12" y1="9" x2="12" y2="15" />
        </svg>
      );
    case "basic-sea-survival":
      return (
        <svg {...common}>
          <path d="M2 16c1.5 0 3-1 4-2s3-4 6-2 4 2 6 0 3-2 4-4" />
          <path d="M22 16v-4" />
          <line x1="2" y1="16" x2="2" y2="20" />
          <line x1="22" y1="14" x2="22" y2="18" />
        </svg>
      );
    case "basic-fire-first-aid":
      return (
        <svg {...common}>
          <path d="M14 2a8 8 0 0 1 8 8c0 6-10 12-10 12S2 16 2 10a8 8 0 0 1 8-8z" />
          <path d="M14 10a2 2 0 0 1-4 0 2 2 0 0 1 4 0z" />
        </svg>
      );
    case "pelatihan-kendaraan-listrik":
      return (
        <svg {...common}>
          <rect x="1" y="6" width="18" height="12" rx="2" />
          <path d="M19 10h2l2 4h-4" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="15" cy="18" r="2" />
          <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
          <path d="M10 11h4" />
        </svg>
      );
    case "pelatihan-tata-boga":
      return (
        <svg {...common}>
          <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6z" />
          <line x1="6" y1="17" x2="18" y2="17" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
