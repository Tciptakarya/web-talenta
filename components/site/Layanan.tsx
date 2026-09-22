"use client";

import { useEffect, useRef, useState } from "react";
import { ProgramIcon } from "@/components/site/ProgramIcon";
import Reveal from "@/components/site/Reveal";

export type LayananProgram = {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  categoryId: number | null;
};

export type LayananCategory = {
  id: number;
  name: string;
};

/** Section layanan: scroll horizontal + panah (script.js v1 bagian service). */
export default function Layanan({
  programs,
  categories,
}: {
  programs: LayananProgram[];
  categories: LayananCategory[];
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLButtonElement>(null);
  const rightRef = useRef<HTMLButtonElement>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | "all">("all");

  useEffect(() => {
    const grid = gridRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!grid || !left || !right) return;

    const updateArrows = () => {
      left.disabled = grid.scrollLeft <= 0;
      right.disabled =
        grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1;
    };

    const scrollBy = (dir: number) =>
      grid.scrollBy({ left: dir * 310, behavior: "smooth" });

    left.addEventListener("click", () => scrollBy(-1));
    right.addEventListener("click", () => scrollBy(1));
    grid.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    updateArrows();

    return () => {
      grid.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const filteredPrograms =
    activeCategoryId === "all"
      ? programs
      : programs.filter((p) => p.categoryId === activeCategoryId);

  return (
    <section className="section section-alt" id="layanan">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="kicker">Layanan Kami</span>
          <h2>Sebelas jalur pelatihan, satu tujuan: siap kerja</h2>
        </Reveal>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter kategori program">
          <button
            onClick={() => setActiveCategoryId("all")}
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition ${
              activeCategoryId === "all"
                ? "bg-navy text-white"
                : "bg-white text-navy border border-line hover:bg-paper"
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeCategoryId === cat.id
                  ? "bg-navy text-white"
                  : "bg-white text-navy border border-line hover:bg-paper"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="service-scroll-wrap">
          <button
            ref={leftRef}
            className="scroll-arrow scroll-left"
            aria-label="Scroll kiri"
            type="button"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="service-grid" ref={gridRef}>
            {filteredPrograms.map((p, i) => (
              <Reveal className="service-card" key={p.id ?? p.slug}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <div className="service-icon">
                  <ProgramIcon slug={p.slug} />
                </div>
                <h3>{p.judul}</h3>
                <p>{p.deskripsi}</p>
              </Reveal>
            ))}
          </div>
          <button
            ref={rightRef}
            className="scroll-arrow scroll-right"
            aria-label="Scroll kanan"
            type="button"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}