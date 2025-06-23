"use client";

import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

{/* Kalau mau nambah something di navbar lewat sini */}
const navItems = [
  {
    label: "Twitter",
    href: "https://twitter.com/nusapayfinance",
    external: true,
  },
  { label: "Docs", href: "/docs", external: false },
  {
    label: "GitHub",
    href: "https://github.com/Lexirieru/NusaPay",
    external: true,
  },
];

const Navbar: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 74) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  return (
    <nav
      className={`fixed top-0 z-50 w-full h-[74px] px-8 flex items-center justify-between
  backdrop-blur-xl backdrop-saturate-200 bg-white/2 shadow-md overflow-hidden
  transition-transform duration-500 ${
    showNavbar ? "translate-y-0" : "-translate-y-full"
  }`}
    >
      <Link href="/" className="relative group">
        <Image src="/logonusa.png" alt="Logo" width={53} height={61} />
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2
          w-[120px] h-[120px] bg-cyan-400/25 rounded-full blur-2xl opacity-80
          scale-100 group-hover:scale-135 transition-transform duration-500 pointer-events-none origin-left"
        />
      </Link>

      <ul className="flex items-center space-x-20 text-white font-semibold text-m">
        {navItems.map(({ label, href, external }) => (
          <li key={label} className="relative group">
            <Link
              href={href}
              target={external ? "_blank" : "_self"}
              rel={external ? "noopener noreferrer" : undefined}
              className="z-10 relative"
            >
              {label}
            </Link>
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/3
              w-[100px] h-[100px] bg-cyan-400/25 rounded-full blur-2xl opacity-80
              scale-100 group-hover:-translate-y-7 transition-transform duration-500 pointer-events-none origin-center"
            />
          </li>
        ))}
      </ul>

      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2
      w-[140px] h-[140px] bg-cyan-400/25 rounded-full blur-xl opacity-80
      scale-150 transition-transform duration-500 
      pointer-events-none origin-right"
      />

      <button
        className="relative z-10 bg-gradient-to-r from-[#1F1F1F] to-[#00B8FF] 
    text-white font-semibold px-5 py-2 rounded-full shadow group-hover:brightness-110
    transition duration-300 hover:cursor-pointer overflow-hidden"
      >
        <span className="relative z-20">Connect Wallet</span>
      </button>
    </nav>
  );
};

export default Navbar;
