import ScrollReveal from "./ScrollReveal";

export default function Footer() {
  return (
    <footer className="py-8 px-4 bg-zinc-950 border-t border-zinc-800">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-xl">🎮</span>
            <span className="text-lg font-black">
              <span className="text-white">GAME</span>
              <span className="text-cyan-400">CENTER</span>
            </span>
          </div>
          
          <p className="text-zinc-500 text-sm mb-2">
            Copyright © 2026 Pham Thanh Thien. All Rights Reserved.
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-zinc-600">
            <a href="#" className="hover:text-cyan-400 transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Chính sách</a>
            <a href="#map" className="hover:text-cyan-400 transition-colors">Liên hệ</a>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
}