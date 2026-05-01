"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getPoints, pointsToDiscount } from "@/lib/loyalty";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [bookingCount, setBookingCount] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  useEffect(() => {
    if (!user) { router.push("/"); return; }
    const saved = localStorage.getItem("joy-bookings") || "[]";
    setBookingCount(JSON.parse(saved).length);
    const lp = getPoints(user.id);
    setLoyaltyPoints(lp.points);
  }, [user, router]);

  if (!user) return null;

  const discountValue = pointsToDiscount(loyaltyPoints);

  return (
    <main className="min-h-screen bg-zinc-950 pt-20 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8">
          <span className="text-cyan-400 neon-text">HỒ SƠ</span> CÁ NHÂN
        </h1>

        {/* Loyalty Points Card */}
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-purple-300 text-sm font-medium">Điểm tích lũy</div>
              <div className="text-4xl font-black text-white mt-1">{loyaltyPoints}</div>
              <div className="text-xs text-purple-400 mt-1">điểm</div>
            </div>
            <div className="text-right">
              <div className="text-green-400 text-sm font-medium">Giá trị quy đổi</div>
              <div className="text-2xl font-bold text-green-400 mt-1">{discountValue.toLocaleString()}₫</div>
              <div className="text-xs text-zinc-500 mt-1">tối đa được giảm</div>
            </div>
          </div>
          <div className="text-xs text-purple-400/70">
            Mỗi 10.000₫ thanh toán = 10 điểm. 100 điểm = 1.000₫ giảm giá.
          </div>
        </div>

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