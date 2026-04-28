import Image from "next/image";
import { foods } from "./data";
import ScrollReveal from "./ScrollReveal";

export default function Food() {
  return (
    <section className="py-20 px-4 bg-zinc-950 relative overflow-hidden">
      {/* Top gradient */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-zinc-900 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            <span className="text-green-400 neon-text">ĐỒ ĂN</span> & ĐỒ UỐNG
          </h2>
          <p className="text-zinc-400">Nạp năng lượng trước khi chơi</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foods.map((food, idx) => (
            <ScrollReveal key={food.id} direction="up" delay={idx * 100}>
              <div className="group rounded-xl overflow-hidden glass hover:border-green-500/50 transition-all cursor-pointer">
                <div className="relative h-32 overflow-hidden">
                  <Image
                    src={food.image}
                    alt={food.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Overlay with Add button */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-4 py-2 bg-green-500 text-black font-medium rounded-lg transform scale-90 group-hover:scale-100 transition-transform">
                      + Thêm vào giỏ
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1 group-hover:text-green-400 transition-colors">{food.name}</h3>
                  <p className="text-zinc-500 text-sm mb-2 line-clamp-1">{food.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-bold">{food.price.toLocaleString()}₫</span>
                    <button className="px-3 py-1 bg-green-600/20 hover:bg-green-600 text-green-400 text-sm rounded-lg transition-colors">
                      + Thêm
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <div className="mt-12 text-center">
            <button className="group px-6 py-3 border border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-medium rounded-lg transition-all inline-flex items-center gap-2">
              XEM MENU ĐẦY ĐỦ 
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