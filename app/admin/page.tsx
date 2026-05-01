"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Booking {
  id: string;
  comboName: string;
  bookingDate: string;
  bookingTime: string;
  playerCount: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  notes?: string;
  paid?: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const auth = sessionStorage.getItem("joy-admin");
    if (auth) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const saved = localStorage.getItem("joy-bookings") || "[]";
    setBookings(JSON.parse(saved));
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      sessionStorage.setItem("joy-admin", "true");
      setIsAuthenticated(true);
    } else {
      alert("Sai mật khẩu!");
    }
  };

  const updateStatus = (id: string, status: string) => {
    const updated = bookings.map((b) => b.id === id ? { ...b, status } : b);
    setBookings(updated);
    localStorage.setItem("joy-bookings", JSON.stringify(updated));
  };

  const deleteBooking = (id: string) => {
    if (!confirm("Xóa đơn này?")) return;
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem("joy-bookings", JSON.stringify(updated));
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const totalRevenue = bookings.filter((b) => b.status === "confirmed").reduce((sum, b) => sum + b.totalPrice, 0);
  const paidCount = bookings.filter((b) => b.paid).length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-sm">
          <h1 className="text-2xl font-black text-white mb-2 text-center">🔐 ADMIN</h1>
          <p className="text-zinc-400 text-sm mb-6 text-center">Joy Station Dashboard</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Mật khẩu admin" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none" />
            <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg">Đăng nhập</button>
          </form>
          <button onClick={() => router.push("/")} className="w-full mt-4 text-sm text-zinc-500 hover:text-zinc-300">← Quay lại trang chủ</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 pt-20 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-white">
            <span className="text-cyan-400 neon-text">ADMIN</span> DASHBOARD
          </h1>
          <div className="flex gap-3">
            <button onClick={() => router.push("/")} className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 text-sm">
              ← Trang chủ
            </button>
            <button onClick={() => { sessionStorage.removeItem("joy-admin"); setIsAuthenticated(false); }} className="px-4 py-2 text-red-400 text-sm hover:bg-red-500/10 rounded-lg">
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-zinc-400 text-sm mb-1">Tổng đơn</div>
            <div className="text-2xl font-black text-white">{bookings.length}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-yellow-400 text-sm mb-1">Chờ xác nhận</div>
            <div className="text-2xl font-black text-yellow-400">{pendingCount}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-green-400 text-sm mb-1">Đã thanh toán</div>
            <div className="text-2xl font-black text-green-400">{paidCount}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-cyan-400 text-sm mb-1">Doanh thu</div>
            <div className="text-2xl font-black text-cyan-400">{totalRevenue.toLocaleString()}₫</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {[{ key: "all", label: "Tất cả" }, { key: "pending", label: "Chờ xác nhận" }, { key: "confirmed", label: "Đã xác nhận" }, { key: "cancelled", label: "Đã hủy" }].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f.key ? "bg-cyan-500 text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Bookings table */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">Không có đơn nào</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking) => (
              <div key={booking.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm text-zinc-500 font-mono">{booking.id}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        booking.paid ? "bg-green-500/20 text-green-400" :
                        booking.status === "confirmed" ? "bg-blue-500/20 text-blue-400" :
                        booking.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {booking.paid ? "Đã thanh toán" : booking.status === "pending" ? "Chờ" : booking.status === "confirmed" ? "OK" : "Hủy"}
                      </span>
                    </div>
                    <h3 className="font-bold text-white">{booking.comboName}</h3>
                    <div className="text-sm text-zinc-400 mt-1">
                      👤 {booking.guestName} • 📱 {booking.guestPhone} • 👥 {booking.playerCount} người
                    </div>
                    <div className="text-sm text-zinc-500 mt-1">
                      📅 {booking.bookingDate} • 🕐 {booking.bookingTime}
                      {booking.notes && ` • 📝 ${booking.notes}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-cyan-400">{booking.totalPrice.toLocaleString()}₫</span>
                    {booking.status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(booking.id, "confirmed")} className="px-3 py-1.5 bg-green-500 hover:bg-green-400 text-black text-sm font-bold rounded-lg">✓</button>
                        <button onClick={() => updateStatus(booking.id, "cancelled")} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 text-sm font-bold rounded-lg">✕</button>
                      </>
                    )}
                    <button onClick={() => deleteBooking(booking.id)} className="px-3 py-1.5 text-zinc-600 hover:text-red-400 text-sm">🗑</button>
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