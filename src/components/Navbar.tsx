"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 74) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full h-[74px] px-6 sm:px-8 flex items-center justify-between
        backdrop-blur-xl backdrop-saturate-200 bg-white/5 shadow-md transition-transform duration-500 ease-in-out
        ${showNavbar ? "translate-y-0" : "-translate-y-full"} relative overflow-hidden`}
      >
        {/* Logo */}
        <Link href="/" className="relative z-10 group">
          <Image src="/logonusa.png" alt="Logo" width={53} height={61} />
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2
            w-[120px] h-[120px] bg-cyan-400/40 rounded-full blur-2xl opacity-80
            scale-100 group-hover:scale-135 transition-transform duration-500 pointer-events-none origin-left"
          />
        </Link>

        {/* Desktop Nav Items */}
        <ul className="hidden lg:flex items-center space-x-12 text-white font-semibold z-10">
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
                w-[100px] h-[100px] bg-cyan-400/40 rounded-full blur-2xl opacity-80
                scale-100 group-hover:-translate-y-8 transition-transform duration-500 pointer-events-none origin-center"
              />
            </li>
          ))}
        </ul>

        {/* Glow aura connect button (desktop only) */}
        <div className="hidden lg:block relative group z-10">
          <div
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2
            w-[140px] h-[140px] bg-cyan-400/25 rounded-full blur-2xl opacity-80
            scale-150 group-hover:scale-[1.7] transition-transform duration-500 pointer-events-none origin-right"
          />
          <button
            className="relative z-10 bg-gradient-to-r from-[#1F1F1F] to-[#00B8FF] 
            text-white font-semibold px-5 py-2 rounded-full shadow hover:scale-105
            transition duration-300 hover:cursor-pointer"
          >
            <span className="relative z-20">Connect Wallet</span>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden z-20">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white text-2xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <RxCross2 /> : <RxHamburgerMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[74px] left-0 w-full bg-[#10151a] text-white z-40 flex flex-col items-center py-6 space-y-6">
          {navItems.map(({ label, href, external }) => (
            <Link
              key={label}
              href={href}
              target={external ? "_blank" : "_self"}
              rel={external ? "noopener noreferrer" : undefined}
              className="text-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          {/* Connect Button in Mobile */}
          <button
            className="bg-gradient-to-r from-[#1F1F1F] to-[#00B8FF] text-white font-semibold px-6 py-3 rounded-full shadow"
            onClick={() => setMobileMenuOpen(false)}
          >
            Connect Wallet
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
