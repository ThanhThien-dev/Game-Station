"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = heroRef.current?.querySelectorAll(".animate-on-load");
    elements?.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 100}ms`;
      requestAnimationFrame(() => {
        el.classList.add("opacity-100", "translate-none");
      });
    });
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center gradient-bg overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-on-load absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-[128px] animate-pulse-glow opacity-0 translate-y-10 transition-all duration-1000" />
        <div className="animate-on-load absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full blur-[128px] animate-pulse-glow opacity-0 translate-y-10 transition-all duration-1000" style={{ animationDelay: "1s" }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} 
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <div className="animate-on-load opacity-0 translate-y-10 transition-all duration-700 ease-out mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-cyan-400">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          OPEN 10:00 - 24:00
        </div>

        <h1 className="animate-on-load opacity-0 translate-y-10 transition-all duration-700 ease-out text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
          <span className="text-white neon-text inline-block">GAME</span>
          <br className="md:hidden" />
          <span className="text-cyan-400 neon-text inline-block"> CENTER</span>
        </h1>

        <p className="animate-on-load opacity-0 translate-y-10 transition-all duration-700 ease-out text-xl md:text-2xl text-zinc-400 mb-8 max-w-2xl mx-auto">
          Trải nghiệm chơi game đỉnh cao với thiết bị hiện đại
        </p>

        <div className="animate-on-load opacity-0 translate-y-10 transition-all duration-700 ease-out flex flex-col sm:flex-row gap-4 justify-center">
          <button className="group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50">
            <span className="relative z-10">CHƠI NGAY</span>
            <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button className="group px-8 py-4 border border-zinc-700 hover:border-cyan-500 text-white font-medium rounded-lg transition-all hover:bg-cyan-500/10">
            XEM COMBO
          </button>
        </div>

        <div className="animate-on-load opacity-0 translate-y-10 transition-all duration-700 ease-out mt-12 flex items-center justify-center gap-8 text-zinc-500">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">50+</div>
            <div className="text-sm">Games</div>
          </div>
          <div className="w-px h-12 bg-zinc-800" />
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">1000+</div>
            <div className="text-sm">Players</div>
          </div>
          <div className="w-px h-12 bg-zinc-800" />
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">4.9</div>
            <div className="text-sm">Rating</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="animate-on-load opacity-0 translate-y-10 transition-all duration-700 ease-out absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-zinc-500">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-zinc-600 rounded-full flex justify-center pt-1">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}