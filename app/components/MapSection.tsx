import { location } from "./data";
import ScrollReveal from "./ScrollReveal";

export default function MapSection() {
  return (
    <section className="py-20 px-4 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            <span className="text-cyan-400 neon-text">TÌM</span> CHÚNG TÔI
          </h2>
          <p className="text-zinc-400">Ghé thăm Gaming Center ngay hôm nay</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ScrollReveal direction="left">
            <div className="rounded-xl overflow-hidden glass hover:border-cyan-500/30 transition-all group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.509992233818!2d106.68829711478638!3d10.77223239231945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f2111581811%3A0x1e61a63d53ef206e!2sHo%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1609459200000"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="space-y-4">
              <div className="group flex items-start gap-4 p-4 rounded-xl glass hover:border-cyan-500/30 transition-all cursor-pointer">
                <div className="p-3 bg-cyan-500/20 rounded-lg group-hover:bg-cyan-500/40 transition-colors">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">Địa chỉ</h3>
                  <p className="text-zinc-400">{location.address}</p>
                </div>
              </div>

              <div className="group flex items-start gap-4 p-4 rounded-xl glass hover:border-pink-500/30 transition-all cursor-pointer">
                <div className="p-3 bg-pink-500/20 rounded-lg group-hover:bg-pink-500/40 transition-colors">
                  <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.69l1.154 3.846a1 1 0 00.95.69h5.064a1 1 0 00.95-.69L18.52 6.38a1 1 0 01.95-.69H21a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">Hotline</h3>
                  <p className="text-zinc-400">{location.phone}</p>
                </div>
              </div>

              <div className="group flex items-start gap-4 p-4 rounded-xl glass hover:border-green-500/30 transition-all cursor-pointer">
                <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/40 transition-colors">
                  <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1 group-hover:text-green-400 transition-colors">Giờ mở cửa</h3>
                  <p className="text-zinc-400">{location.hours} (Mỗi ngày)</p>
                </div>
              </div>

              <button className="group w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all hover:scale-[1.02]">
                <span className="inline-flex items-center gap-2">
                  CHỈ ĐƯỜNG NGAY
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}