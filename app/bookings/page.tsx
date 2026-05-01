"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface Booking {
  id: string;
  comboName: string;
  bookingDate: string;
  bookingTime: string;
  playerCount: number;
  guestName: string;
  guestPhone: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  paid?: boolean;
}

export default function BookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    // Load bookings from localStorage (demo)
    const savedBookings = localStorage.getItem("joy-bookings") || "[]";
    setBookings(JSON.parse(savedBookings));
    setLoading(false);
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-zinc-950 pt-20 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8">
          <span className="text-cyan-400 neon-text">LỊCH SỬ</span> ĐẶT COMBO
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-xl font-bold text-white mb-2">Chưa có đơn đặt nào</h2>
            <p className="text-zinc-400 mb-6">Hãy đặt combo để bắt đầu trải nghiệm!</p>
            <button onClick={() => router.push("/")} className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all">
              Đặt combo ngay
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-sm text-zinc-500 font-mono">{booking.id}</span>
                    <h3 className="text-lg font-bold text-white">{booking.comboName}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    booking.paid ? "bg-green-500/20 text-green-400" :
                    booking.status === "confirmed" ? "bg-blue-500/20 text-blue-400" :
                    booking.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {booking.paid ? "Đã thanh toán" : booking.status === "pending" ? "Chờ xác nhận" : booking.status === "confirmed" ? "Đã xác nhận" : "Đã hủy"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-zinc-500">📅</span>
                    <span className="text-zinc-300 ml-2">{booking.bookingDate}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">🕐</span>
                    <span className="text-zinc-300 ml-2">{booking.bookingTime}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">👥</span>
                    <span className="text-zinc-300 ml-2">{booking.playerCount} người</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">💰</span>
                    <span className="text-cyan-400 font-bold ml-2">{booking.totalPrice.toLocaleString()}₫</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}