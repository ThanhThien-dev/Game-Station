"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const comboImages = [
  { src: "/images/combo1.jpg", alt: "Combo Nintendo Switch" },
  { src: "/images/combo2.jpg", alt: "Combo Xbox 360" },
  { src: "/images/combo3.jpg", alt: "Combo PlayStation PS4" },
  { src: "/images/combo4.jpg", alt: "Combo Boardgame" },
];

export default function ComboLightbox({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
    setZoom(1);
  }, []);

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % comboImages.length);
  }, [currentIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo((currentIndex - 1 + comboImages.length) % comboImages.length);
  }, [currentIndex, goTo]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, goNext, goPrev]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={onClose}>
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Main image */}
      <div className="relative w-full h-full flex items-center justify-center p-16" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
          <Image
            src={comboImages[currentIndex].src}
            alt={comboImages[currentIndex].alt}
            width={800}
            height={600}
            className="object-contain max-h-full max-w-full rounded-lg shadow-2xl transition-all duration-200"
            style={{ transform: `scale(${zoom})` }}
          />
          
          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
            {currentIndex + 1} / {comboImages.length}
          </div>

          {/* Image name */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
            {comboImages[currentIndex].alt}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors group"
        >
          <svg className="w-6 h-6 text-white group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors group"
        >
          <svg className="w-6 h-6 text-white group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Zoom controls */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(z - 0.25, 0.5)); }}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            −
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setZoom(1); }}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            ↺
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(z + 0.25, 3)); }}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 p-4" onClick={(e) => e.stopPropagation()}>
        {comboImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`relative w-16 h-12 rounded-lg overflow-hidden transition-all ${
              idx === currentIndex
                ? "ring-2 ring-cyan-400 scale-110"
                : "opacity-50 hover:opacity-100"
            }`}
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}