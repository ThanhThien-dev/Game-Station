"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
  delay?: number;
}

export default function ScrollReveal({ children, className = "", direction = "up", delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-none");
            
            if (direction === "up") {
              (entry.target as HTMLDivElement).classList.remove("translate-y-10", "opacity-0");
            } else if (direction === "left") {
              (entry.target as HTMLDivElement).classList.remove("-translate-x-10", "opacity-0");
            } else if (direction === "right") {
              (entry.target as HTMLDivElement).classList.remove("translate-x-10", "opacity-0");
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      ref.current.classList.add("transition-all", "duration-700", "ease-out");
      if (direction === "up") {
        ref.current.classList.add("translate-y-10", "opacity-0");
      } else if (direction === "left") {
        ref.current.classList.add("-translate-x-10", "opacity-0");
      } else if (direction === "right") {
        ref.current.classList.add("translate-x-10", "opacity-0");
      }
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [direction]);

  return (
    <div ref={ref} className={className} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}