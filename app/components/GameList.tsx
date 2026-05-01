import Image from "next/image";
import { games } from "./data";
import ScrollReveal from "./ScrollReveal";

export default function GameList() {
  return (
    <section className="py-20 px-4 bg-zinc-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-zinc-900 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-zinc-900 to-transparent" />

      <div className="max-w-6xl mx-auto relative">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            <span className="text-cyan-400 neon-text">TRÒ CHƠI</span> NỔI BẬT
          </h2>
          <p className="text-zinc-400">Khám phá các trò chơi hot nhất</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, idx) => (
            <ScrollReveal key={game.id} direction="up" delay={idx * 100}>
              <div className="group relative rounded-xl overflow-hidden glass hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-medium text-cyan-400">
                    {game.category}
                  </div>
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{game.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">👥 {game.players} players</span>
                  </div>
                  <button className="w-full mt-4 py-2 bg-zinc-800 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-all transform group-hover:translate-y-0 translate-y-1 opacity-80 group-hover:opacity-100">
                    ĐẶT NGAY
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <div className="text-center mt-10">
            <button className="group px-6 py-3 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black font-medium rounded-lg transition-all inline-flex items-center gap-2">
              XEM TẤT CẢ 
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}