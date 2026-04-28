import Image from "next/image";
import { combos } from "./data";
import ScrollReveal from "./ScrollReveal";

export default function Combo() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-pink-500 rounded-full blur-[200px] animate-pulse-glow" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[200px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-500 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-cyan-500 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-500 rounded-full animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-pink-400 mb-4">
            <span className="text-xl animate-pulse">⭐</span> BEST SELLERS
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            <span className="text-white">COMBO</span>
            <span className="text-pink-500 neon-text"> GIÁ TRỊ</span>
          </h2>
          <p className="text-zinc-400 text-lg">Tiết kiệm đến 30% với các combo game + food</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {combos.map((combo, idx) => (
            <ScrollReveal key={combo.id} direction={idx === 1 ? "up" : idx === 0 ? "right" : "left"} delay={idx * 150}>
              <div
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.05] ${
                  combo.popular
                    ? "bg-gradient-to-b from-pink-500/20 to-cyan-500/20 border-2 border-pink-500 neon-border"
                    : "glass hover:border-pink-500/50"
                }`}
              >
                {combo.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded-full z-10 animate-pulse">
                    POPULAR
                  </div>
                )}

                <div className="relative h-40 overflow-hidden group">
                  <Image
                    src={combo.image}
                    alt={combo.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">{combo.name}</h3>
                  <ul className="space-y-2 mb-6">
                    {combo.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-zinc-300">
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <span className="text-zinc-500 line-through text-sm">{combo.originalPrice.toLocaleString()}₫</span>
                    </div>
                    <div className="text-2xl font-black text-pink-400">
                      {combo.price.toLocaleString()}₫
                    </div>
                  </div>

                  <button className={`w-full py-3 font-bold rounded-lg transition-all transform hover:scale-[1.02] ${
                    combo.popular
                      ? "bg-gradient-to-r from-pink-500 to-cyan-500 text-white hover:opacity-90 hover:shadow-lg hover:shadow-pink-500/30"
                      : "bg-zinc-800 hover:bg-pink-600 text-white"
                  }`}>
                    ĐẶT NGAY
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}