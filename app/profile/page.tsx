"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    if (!user) { router.push("/"); return; }
    const saved = localStorage.getItem("joy-bookings") || "[]";
    setBookingCount(JSON.parse(saved).length);
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-zinc-950 pt-20 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8">
          <span className="text-cyan-400 neon-text">HỒ SƠ</span> CÁ NHÂN
        </h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-black text-white">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-zinc-400">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-zinc-800">
              <span className="text-zinc-400">📱 Số điện thoại</span>
              <span className="text-white font-medium">{user.phone || "Chưa cập nhật"}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-zinc-800">
              <span className="text-zinc-400">📋 Đơn đã đặt</span>
              <span className="text-white font-bold">{bookingCount} đơn</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-zinc-400">📧 Email</span>
              <span className="text-white font-medium">{user.email}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => router.push("/bookings")} className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all">
            Xem lịch sử đặt
          </button>
          <button onClick={() => { logout(); router.push("/"); }} className="py-3 px-6 border border-red-500 text-red-400 hover:bg-red-500/10 font-medium rounded-lg transition-all">
            Đăng xuất
          </button>
        </div>
      </div>
    </main>
  );
}