// src/components/Footer.tsx
"use client";
import { BRAND } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="text-center text-sm text-gray-500 py-8 no-print">
      © {new Date().getFullYear()} {BRAND.title} — {BRAND.tagline}.
    </footer>
  );
}
