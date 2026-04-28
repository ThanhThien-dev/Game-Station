import { promotions } from "./data";
import ScrollReveal from "./ScrollReveal";

const colorMap: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  "neon-cyan": { bg: "from-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500", accent: "bg-cyan-500" },
  "neon-pink": { bg: "from-pink-500/20", text: "text-pink-400", border: "border-pink-500", accent: "bg-pink-500" },
  "neon-yellow": { bg: "from-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500", accent: "bg-yellow-500" },
};

export default function Promotion() {
  return (
    <section className="py-20 px-4 bg-zinc-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,.3) 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, rgba(255,255,255,.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} 
      />

      <div className="max-w-6xl mx-auto relative">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            <span className="text-yellow-400 neon-text">KHUYẾN MÃI</span> HOT
          </h2>
          <p className="text-zinc-400">Đừng bỏ lỡ các ưu đãi hấp dẫn!</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo, idx) => {
            const colors = colorMap[promo.color] || colorMap["neon-cyan"];
            return (
              <ScrollReveal key={promo.id} direction="up" delay={idx * 150}>
                <div
                  className={`relative rounded-xl p-6 bg-gradient-to-br ${colors.bg} to-transparent ${colors.border} border hover:scale-[1.02] transition-all duration-300 cursor-pointer group overflow-hidden`}
                >
                  {/* Animated shine */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000`} />
                  
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                    <div className={`w-full h-full rounded-full ${colors.bg} blur-2xl`} />
                  </div>
                  
                  <div className={`relative text-4xl font-black mb-2 ${colors.text}`}>
                    {promo.discount}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{promo.title}</h3>
                  <p className="text-zinc-400 text-sm mb-4">{promo.description}</p>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {promo.validUntil}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={300}>
          <div className="mt-12 text-center">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg hover:opacity-90 transition-all overflow-hidden">
              <span className="relative z-10">NHẬN ƯU ĐÃI NGAY</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}