"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/(calculadoras)/muros", label: "Muros ICF" },
  { href: "/(calculadoras)/makros", label: "Makros" },
  { href: "/(calculadoras)/joists", label: "Joists" },
  { href: "/(calculadoras)/steelfoam", label: "SteelFoam" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/icf-logo-blue.png" // asegúrate de tener este archivo en /public
            alt="ICF MEXICO"
            width={140}
            height={40}
            priority
          />
        </Link>

        {/* Menú */}
        <div className="flex space-x-5 text-sm font-semibold">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  active
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-800 hover:text-red-600"
                } transition-colors pb-1`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
