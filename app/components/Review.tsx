import Image from "next/image";
import { reviews } from "./data";
import ScrollReveal from "./ScrollReveal";

export default function Review() {
  return (
    <section className="py-20 px-4 bg-zinc-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />

      <div className="max-w-6xl mx-auto relative">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            <span className="text-purple-400 neon-text">ĐÁNH GIÁ</span> KHÁCH HÀNG
          </h2>
          <p className="text-zinc-400">Xem review từ game thủ</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <ScrollReveal key={review.id} direction={idx === 1 ? "up" : idx === 0 ? "right" : "left"} delay={idx * 150}>
              <div className="p-6 rounded-xl glass hover:border-purple-500/50 transition-all duration-300 group cursor-pointer">
                {/* Top quote icon */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-zinc-700"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-zinc-300 mb-4">&quot;{review.comment}&quot;</p>

                <div className="flex items-center gap-3">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={44}
                    height={44}
                    className="rounded-full border-2 border-purple-500/30 group-hover:border-purple-500 transition-colors"
                  />
                  <div>
                    <div className="font-bold text-white">{review.name}</div>
                    <div className="text-sm text-zinc-500">Game: {review.game}</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={300}>
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-700"
                />
              ))}
            </div>
            <span className="text-zinc-400">+1000+ game thủ khác</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}