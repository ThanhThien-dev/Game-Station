"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import NotificationBell from "./NotificationBell";

export default function Navigation({ onBookClick }: { onBookClick: () => void }) {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#games", label: "Games" },
    { href: "#combo", label: "Combo" },
    { href: "#promo", label: "Khuyến mãi" },
    { href: "#food", label: "Food" },
    { href: "#map", label: "Liên hệ" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">🎮</span>
            <span className="text-xl font-black group-hover:scale-105 transition-transform">
              <span className="text-white">JOY</span>
              <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">STATION</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-zinc-300 hover:text-cyan-400 transition-all duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onBookClick} className="hidden md:block px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30">
              Đặt ngay
            </button>

            {user && <NotificationBell />}

            {user ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-cyan-400">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-48 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-xl z-50">
                    <a href="/profile" className="block px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-cyan-400">👤 Hồ sơ của tôi</a>
                    <a href="/bookings" className="block px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-cyan-400">📋 Lịch sử đặt</a>
                    <button onClick={() => { logout(); setShowUserMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-zinc-800">🚪 Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => onBookClick()} className="hidden md:flex items-center gap-2 px-4 py-2 border border-zinc-700 hover:border-cyan-500 text-white text-sm font-medium rounded-lg transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Đăng nhập
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-white hover:text-cyan-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-zinc-800 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-zinc-300 hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button onClick={onBookClick} className="px-4 py-2 bg-cyan-500 text-black font-medium rounded-lg">
              Đặt ngay
            </button>
            {user ? (
              <div className="border-t border-zinc-700 pt-4 space-y-2">
                <div className="text-white text-sm">Xin chào, <span className="font-bold">{user.name}</span></div>
                <a href="/profile" className="block text-zinc-300 hover:text-cyan-400 text-sm">👤 Hồ sơ</a>
                <a href="/bookings" className="block text-zinc-300 hover:text-cyan-400 text-sm">📋 Lịch sử đặt</a>
                <button onClick={logout} className="text-red-400 text-sm">🚪 Đăng xuất</button>
              </div>
            ) : (
              <button onClick={() => onBookClick()} className="px-4 py-2 border border-zinc-700 text-white text-sm font-medium rounded-lg">
                Đăng nhập / Đăng ký
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}