"use client";

import { useState, useEffect, useMemo } from "react";
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
  voucherCode?: string;
  adminNotes?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "price" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const togglePaid = (id: string) => {
    const updated = bookings.map((b) => b.id === id ? { ...b, paid: !b.paid } : b);
    setBookings(updated);
    localStorage.setItem("joy-bookings", JSON.stringify(updated));
  };

  const deleteBooking = (id: string) => {
    if (!confirm("Xóa đơn này?")) return;
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem("joy-bookings", JSON.stringify(updated));
    if (detailBooking?.id === id) setDetailBooking(null);
  };

  const saveAdminNote = (id: string) => {
    const updated = bookings.map((b) => b.id === id ? { ...b, adminNotes: adminNoteInput } : b);
    setBookings(updated);
    localStorage.setItem("joy-bookings", JSON.stringify(updated));
    setDetailBooking({ ...detailBooking!, adminNotes: adminNoteInput });
  };

  const bulkUpdateStatus = (status: string) => {
    const updated = bookings.map((b) => selectedBookings.includes(b.id) ? { ...b, status } : b);
    setBookings(updated);
    localStorage.setItem("joy-bookings", JSON.stringify(updated));
    setSelectedBookings([]);
    setShowBulkActions(false);
  };

  const bulkTogglePaid = () => {
    const updated = bookings.map((b) => selectedBookings.includes(b.id) ? { ...b, paid: !b.paid } : b);
    setBookings(updated);
    localStorage.setItem("joy-bookings", JSON.stringify(updated));
    setSelectedBookings([]);
    setShowBulkActions(false);
  };

  const exportBookings = () => {
    const dataToExport = filtered.length > 0 ? filtered : bookings;
    const csv = [
      "Mã đơn,Combo,Ngày,Giờ,Khách,SĐT,Email,Số người,Tổng tiền,Trạng thái,Đã thanh toán,Ghi chú,Ngày tạo",
      ...dataToExport.map((b) =>
        `${b.id},${b.comboName},${b.bookingDate},${b.bookingTime},${b.guestName},${b.guestPhone},${b.guestEmail},${b.playerCount},${b.totalPrice},${b.status},${b.paid ? "Có" : "Chưa"},"${b.notes || ""}",${b.createdAt}`
      ),
    ].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const toggleSelect = (id: string) => {
    setSelectedBookings((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    setSelectedBookings(selectedBookings.length === filtered.length ? [] : filtered.map((b) => b.id));
  };

  const filtered = useMemo(() => {
    let result = bookings;
    if (filter !== "all") result = result.filter((b) => b.status === filter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) =>
        b.id.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.guestPhone.includes(q) ||
        b.comboName.toLowerCase().includes(q)
      );
    }
    if (dateFrom) result = result.filter((b) => b.bookingDate >= dateFrom);
    if (dateTo) result = result.filter((b) => b.bookingDate <= dateTo);

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "date") cmp = a.bookingDate.localeCompare(b.bookingDate) || a.bookingTime.localeCompare(b.bookingTime);
      else if (sortBy === "price") cmp = a.totalPrice - b.totalPrice;
      else cmp = a.guestName.localeCompare(b.guestName);
      return sortOrder === "desc" ? -cmp : cmp;
    });

    return result;
  }, [bookings, filter, searchQuery, dateFrom, dateTo, sortBy, sortOrder]);

  const totalRevenue = bookings.filter((b) => b.paid).reduce((sum, b) => sum + b.totalPrice, 0);
  const paidCount = bookings.filter((b) => b.paid).length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  // Calendar helpers
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const formatDate = (d: string) => { const [y, m, day] = d.split("-"); return `${day}/${m}/${y}`; };

  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    bookings.forEach((b) => {
      if (!map[b.bookingDate]) map[b.bookingDate] = [];
      map[b.bookingDate].push(b);
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.bookingTime.localeCompare(b.bookingTime)));
    return map;
  }, [bookings]);

  const selectedDateBookings = selectedDate ? bookingsByDate[selectedDate] || [] : [];

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = getDaysInMonth(calendarMonth);
    const firstDay = getFirstDayOfMonth(calendarMonth);
    const prevMonthDays = getDaysInMonth(new Date(year, month, 0));
    const today = new Date().toISOString().split("T")[0];

    const days: { date: string; day: number; isCurrentMonth: boolean; isToday: boolean; bookingCount: number; bookings: Booking[] }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const d = `${year}-${String(month).padStart(2, "0")}-${String(prevMonthDays - i).padStart(2, "0")}`;
      const dayNum = prevMonthDays - i;
      days.push({ date: d, day: dayNum, isCurrentMonth: false, isToday: d === today, bookingCount: bookingsByDate[d]?.length || 0, bookings: bookingsByDate[d] || [] });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const d = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ date: d, day: i, isCurrentMonth: true, isToday: d === today, bookingCount: bookingsByDate[d]?.length || 0, bookings: bookingsByDate[d] || [] });
    }

    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = `${year}-${String(month + 2).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        days.push({ date: d, day: i, isCurrentMonth: false, isToday: d === today, bookingCount: bookingsByDate[d]?.length || 0, bookings: bookingsByDate[d] || [] });
      }
    }

    return days;
  }, [calendarMonth, bookingsByDate]);

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

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
          <p className="text-zinc-400 text-sm mt-3 text-center">Dev version password: admin123</p>
          <button onClick={() => router.push("/")} className="w-full mt-4 text-sm text-zinc-500 hover:text-zinc-300">← Quay lại trang chủ</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 pt-20 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-white">
            <span className="text-cyan-400 neon-text">ADMIN</span> DASHBOARD
          </h1>
          <div className="flex gap-3">
            <button onClick={exportBookings} className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium transition-all">
              📥 Export CSV
            </button>
            <button onClick={() => router.push("/")} className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 text-sm">
              ← Trang chủ
            </button>
            <button onClick={() => { sessionStorage.removeItem("joy-admin"); setIsAuthenticated(false); }} className="px-4 py-2 text-red-400 text-sm hover:bg-red-500/10 rounded-lg">
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-zinc-400 text-sm mb-1">Tổng đơn</div>
            <div className="text-2xl font-black text-white">{bookings.length}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-yellow-400 text-sm mb-1">Chờ xác nhận</div>
            <div className="text-2xl font-black text-yellow-400">{pendingCount}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-blue-400 text-sm mb-1">Đã xác nhận</div>
            <div className="text-2xl font-black text-blue-400">{confirmedCount}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-green-400 text-sm mb-1">Đã thanh toán</div>
            <div className="text-2xl font-black text-green-400">{paidCount}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-cyan-400 text-sm mb-1">Doanh thu</div>
            <div className="text-xl font-black text-cyan-400">{totalRevenue.toLocaleString()}₫</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Tìm theo mã đơn, tên khách, SĐT, combo..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-cyan-500 focus:outline-none" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-cyan-500 focus:outline-none" />
            <select value={`${sortBy}-${sortOrder}`} onChange={(e) => { const [by, order] = e.target.value.split("-"); setSortBy(by as any); setSortOrder(order as any); }} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-cyan-500 focus:outline-none">
              <option value="date-desc">Mới nhất</option>
              <option value="date-asc">Cũ nhất</option>
              <option value="price-desc">Cao nhất</option>
              <option value="price-asc">Thấp nhất</option>
              <option value="name-asc">A-Z</option>
              <option value="name-desc">Z-A</option>
            </select>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {[{ key: "all", label: `Tất cả (${bookings.length})` }, { key: "pending", label: `Chờ xác nhận (${pendingCount})` }, { key: "confirmed", label: `Đã xác nhận (${confirmedCount})` }, { key: "completed", label: `Hoàn thành` }, { key: "cancelled", label: `Đã hủy` }].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f.key ? "bg-cyan-500 text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
              {f.label}
            </button>
          ))}
          <div className="ml-auto flex bg-zinc-800 rounded-lg p-1 gap-1">
            <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "list" ? "bg-cyan-500 text-black" : "text-zinc-400 hover:text-white"}`}>
              📋 Danh sách
            </button>
            <button onClick={() => setViewMode("calendar")} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "calendar" ? "bg-cyan-500 text-black" : "text-zinc-400 hover:text-white"}`}>
              📅 Lịch
            </button>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
            {/* Calendar grid */}
            <div className="xl:col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">
                  ← Tháng trước
                </button>
                <h2 className="text-lg font-bold text-white">
                  {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                </h2>
                <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">
                  Tháng sau →
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((d) => (
                  <div key={d} className="text-center text-xs text-zinc-500 font-medium py-2">{d}</div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => day.isCurrentMonth && day.bookingCount > 0 && setSelectedDate(day.date)}
                    className={`relative aspect-square rounded-lg p-1 flex flex-col items-center justify-start transition-all text-xs ${
                      !day.isCurrentMonth ? "opacity-30" :
                      selectedDate === day.date ? "bg-cyan-500/20 border border-cyan-500/50" :
                      day.isToday ? "bg-cyan-500/10 border border-cyan-500/30" :
                      day.bookingCount > 0 ? "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 cursor-pointer" :
                      "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
                    }`}
                  >
                    <span className={`font-medium ${day.isToday ? "text-cyan-400 font-bold" : day.isCurrentMonth ? "text-white" : "text-zinc-500"}`}>
                      {day.day}
                    </span>
                    {day.bookingCount > 0 && (
                      <div className="flex flex-wrap gap-0.5 justify-center mt-0.5">
                        {day.bookings.slice(0, 4).map((b, bi) => (
                          <div key={bi} className={`w-1.5 h-1.5 rounded-full ${
                            b.paid ? "bg-green-400" :
                            b.status === "confirmed" ? "bg-blue-400" :
                            b.status === "cancelled" ? "bg-red-400" :
                            "bg-yellow-400"
                          }`} />
                        ))}
                        {day.bookingCount > 4 && (
                          <span className="text-[8px] text-zinc-400 leading-none">+{day.bookingCount - 4}</span>
                        )}
                      </div>
                    )}
                    {day.bookingCount > 0 && (
                      <span className="text-[9px] text-zinc-400 mt-0.5">{day.bookingCount}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-zinc-800">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400"><div className="w-2 h-2 rounded-full bg-yellow-400" /> Chờ xác nhận</div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400"><div className="w-2 h-2 rounded-full bg-blue-400" /> Đã xác nhận</div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400"><div className="w-2 h-2 rounded-full bg-green-400" /> Đã thanh toán</div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400"><div className="w-2 h-2 rounded-full bg-red-400" /> Đã hủy</div>
              </div>
            </div>

            {/* Selected date bookings panel */}
            <div className="xl:col-span-1">
              {selectedDate ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">📅 {formatDate(selectedDate)}</h3>
                    <button onClick={() => setSelectedDate(null)} className="text-zinc-500 hover:text-white text-xs">✕</button>
                  </div>
                  {selectedDateBookings.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500 text-sm">Không có booking</div>
                  ) : (
                    <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                      {selectedDateBookings.map((b) => (
                        <div key={b.id} className="bg-zinc-800 rounded-lg p-3 cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => { setDetailBooking(b); setAdminNoteInput(b.adminNotes || ""); }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              b.paid ? "bg-green-500/20 text-green-400" :
                              b.status === "confirmed" ? "bg-blue-500/20 text-blue-400" :
                              b.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                              "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {b.status === "pending" ? "Chờ" : b.status === "confirmed" ? "OK" : b.status === "completed" ? "Xong" : "Hủy"}
                            </span>
                            <span className="text-xs font-mono text-zinc-500">{b.id}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-bold text-cyan-400">{b.bookingTime}</span>
                            <span className="text-sm text-white font-medium">{b.comboName}</span>
                          </div>
                          <div className="text-xs text-zinc-400">👤 {b.guestName} • 👥 {b.playerCount}</div>
                          <div className="text-xs text-zinc-400">📱 {b.guestPhone}</div>
                          <div className="text-sm font-bold text-white mt-1">{b.totalPrice.toLocaleString()}₫</div>
                          {b.notes && <div className="text-xs text-zinc-500 mt-1 truncate">📝 {b.notes}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center sticky top-24">
                  <div className="text-3xl mb-3">👈</div>
                  <div className="text-zinc-400 text-sm">Chọn ngày trên lịch để xem chi tiết booking</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bulk actions bar */}
        {selectedBookings.length > 0 && (
          <div className="bg-zinc-800 border border-cyan-500/30 rounded-xl p-4 mb-4 flex flex-wrap items-center gap-3">
            <span className="text-cyan-400 text-sm font-medium">Đã chọn {selectedBookings.length} đơn</span>
            <div className="flex gap-2">
              <button onClick={() => bulkUpdateStatus("confirmed")} className="px-3 py-1.5 bg-green-500 hover:bg-green-400 text-black text-xs font-bold rounded-lg">✓ Xác nhận</button>
              <button onClick={() => bulkUpdateStatus("completed")} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-lg">✓ Hoàn thành</button>
              <button onClick={() => bulkUpdateStatus("cancelled")} className="px-3 py-1.5 bg-red-500 hover:bg-red-400 text-white text-xs font-bold rounded-lg">✕ Hủy</button>
              <button onClick={bulkTogglePaid} className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-lg">💰 Đổi TT thanh toán</button>
            </div>
            <button onClick={() => setSelectedBookings([])} className="ml-auto text-zinc-400 hover:text-white text-xs">Bỏ chọn</button>
          </div>
        )}

        {/* Bookings list view */}
        {viewMode === "list" && (
          <>
            {/* Bookings table header (desktop) */}
            <div className="hidden lg:grid grid-cols-12 gap-2 px-4 py-2 text-xs text-zinc-500 font-medium uppercase tracking-wide border-b border-zinc-800">
          <div className="col-span-1">
            <input type="checkbox" checked={selectedBookings.length === filtered.length && filtered.length > 0} onChange={selectAll} className="accent-cyan-500" />
          </div>
          <div className="col-span-2">Mã đơn / Combo</div>
          <div className="col-span-2">Khách hàng</div>
          <div className="col-span-2">Ngày / Giờ</div>
          <div className="col-span-1">Số người</div>
          <div className="col-span-1">Tổng tiền</div>
          <div className="col-span-1">Thanh toán</div>
          <div className="col-span-1">Trạng thái</div>
          <div className="col-span-1">Thao tác</div>
        </div>

        {/* Bookings list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="text-4xl mb-4">📭</div>
            <div className="text-zinc-400">Không tìm thấy đơn nào</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking) => (
              <div key={booking.id} className={`bg-zinc-900 border rounded-xl p-4 transition-all cursor-pointer hover:border-zinc-600 ${
                selectedBookings.includes(booking.id) ? "border-cyan-500 bg-cyan-500/5" : "border-zinc-800"
              }`}>
                <div className="flex items-start gap-3">
                  <div className="hidden lg:flex pt-1">
                    <input type="checkbox" checked={selectedBookings.includes(booking.id)} onChange={() => toggleSelect(booking.id)} onClick={(e) => e.stopPropagation()} className="accent-cyan-500 mt-0.5" />
                  </div>
                  <div className="flex-1 min-w-0" onClick={() => { setDetailBooking(booking); setAdminNoteInput(booking.adminNotes || ""); }}>
                    {/* Desktop view */}
                    <div className="hidden lg:grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-2">
                        <div className="text-xs text-zinc-500 font-mono">{booking.id}</div>
                        <div className="font-bold text-white text-sm">{booking.comboName}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-white">{booking.guestName}</div>
                        <div className="text-xs text-zinc-400">{booking.guestPhone}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-white">📅 {booking.bookingDate}</div>
                        <div className="text-xs text-zinc-400">🕐 {booking.bookingTime}</div>
                      </div>
                      <div className="col-span-1 text-sm text-white text-center">👥 {booking.playerCount}</div>
                      <div className="col-span-1 text-sm font-bold text-cyan-400">{booking.totalPrice.toLocaleString()}₫</div>
                      <div className="col-span-1">
                        <button onClick={(e) => { e.stopPropagation(); togglePaid(booking.id); }} className={`text-xs px-2 py-1 rounded font-bold ${booking.paid ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"}`}>
                          {booking.paid ? "✓ Đã TT" : "○ Chưa TT"}
                        </button>
                      </div>
                      <div className="col-span-1">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          booking.status === "completed" ? "bg-blue-500/20 text-blue-400" :
                          booking.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                          booking.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                          "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {booking.status === "pending" ? "Chờ" : booking.status === "confirmed" ? "OK" : booking.status === "completed" ? "Xong" : "Hủy"}
                        </span>
                      </div>
                      <div className="col-span-1 flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setDetailBooking(booking); setAdminNoteInput(booking.adminNotes || ""); }} className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded">👁</button>
                        <button onClick={(e) => { e.stopPropagation(); deleteBooking(booking.id); }} className="px-2 py-1 text-zinc-600 hover:text-red-400 text-xs">🗑</button>
                      </div>
                    </div>

                    {/* Mobile view */}
                    <div className="lg:hidden space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked={selectedBookings.includes(booking.id)} onChange={() => toggleSelect(booking.id)} onClick={(e) => e.stopPropagation()} className="accent-cyan-500" />
                          <span className="text-xs text-zinc-500 font-mono">{booking.id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            booking.status === "completed" ? "bg-blue-500/20 text-blue-400" :
                            booking.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                            booking.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                            "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {booking.status === "pending" ? "Chờ" : booking.status === "confirmed" ? "OK" : booking.status === "completed" ? "Xong" : "Hủy"}
                          </span>
                          {booking.paid && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded">Đã TT</span>}
                        </div>
                        <span className="text-lg font-bold text-cyan-400">{booking.totalPrice.toLocaleString()}₫</span>
                      </div>
                      <h3 className="font-bold text-white">{booking.comboName}</h3>
                      <div className="text-sm text-zinc-400">
                        👤 {booking.guestName} • 📱 {booking.guestPhone} • 👥 {booking.playerCount}
                      </div>
                      <div className="text-sm text-zinc-500">📅 {booking.bookingDate} • 🕐 {booking.bookingTime}</div>
                      <div className="flex gap-2 pt-1">
                        <button onClick={(e) => { e.stopPropagation(); setDetailBooking(booking); setAdminNoteInput(booking.adminNotes || ""); }} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg">👁 Chi tiết</button>
                        {booking.status === "pending" && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); updateStatus(booking.id, "confirmed"); }} className="px-3 py-1.5 bg-green-500 hover:bg-green-400 text-black text-xs font-bold rounded-lg">✓ Xác nhận</button>
                            <button onClick={(e) => { e.stopPropagation(); updateStatus(booking.id, "cancelled"); }} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 text-xs font-bold rounded-lg">✕ Hủy</button>
                          </>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); togglePaid(booking.id); }} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg">
                          {booking.paid ? "↩ Chưa TT" : "✓ Đã TT"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {/* Booking Detail Modal */}
        {detailBooking && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setDetailBooking(null)}>
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900 z-10">
                <h2 className="text-lg font-bold text-white">Chi tiết đơn đặt</h2>
                <button onClick={() => setDetailBooking(null)} className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-zinc-500">{detailBooking.id}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    detailBooking.status === "completed" ? "bg-blue-500/20 text-blue-400" :
                    detailBooking.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                    detailBooking.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {detailBooking.status === "pending" ? "Chờ xác nhận" : detailBooking.status === "confirmed" ? "Đã xác nhận" : detailBooking.status === "completed" ? "Hoàn thành" : "Đã hủy"}
                  </span>
                  {detailBooking.paid ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">✓ Đã thanh toán</span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded">○ Chưa thanh toán</span>
                  )}
                </div>

                <div className="bg-zinc-800 rounded-xl p-4 space-y-3">
                  <h3 className="font-bold text-white text-lg">{detailBooking.comboName}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-zinc-500">👤 Khách:</span> <span className="text-white">{detailBooking.guestName}</span></div>
                    <div><span className="text-zinc-500">📱 SĐT:</span> <span className="text-white">{detailBooking.guestPhone}</span></div>
                    <div><span className="text-zinc-500">📧 Email:</span> <span className="text-white">{detailBooking.guestEmail || "-"}</span></div>
                    <div><span className="text-zinc-500">👥 Số người:</span> <span className="text-white">{detailBooking.playerCount}</span></div>
                    <div><span className="text-zinc-500">📅 Ngày:</span> <span className="text-white">{detailBooking.bookingDate}</span></div>
                    <div><span className="text-zinc-500">🕐 Giờ:</span> <span className="text-white">{detailBooking.bookingTime}</span></div>
                  </div>
                  <div className="border-t border-zinc-700 pt-3 flex justify-between items-center">
                    <span className="text-zinc-400">Tổng tiền:</span>
                    <span className="text-xl font-black text-cyan-400">{detailBooking.totalPrice.toLocaleString()}₫</span>
                  </div>
                  {detailBooking.notes && (
                    <div className="bg-zinc-900 rounded-lg p-3">
                      <span className="text-zinc-500 text-xs">Ghi chú khách:</span>
                      <p className="text-zinc-300 text-sm mt-1">{detailBooking.notes}</p>
                    </div>
                  )}
                  {detailBooking.voucherCode && (
                    <div className="text-sm"><span className="text-zinc-500">Voucher:</span> <span className="text-green-400 font-bold">{detailBooking.voucherCode}</span></div>
                  )}
                </div>

                {/* Admin notes */}
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">📝 Ghi chú admin</label>
                  <textarea
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="Thêm ghi chú nội bộ..."
                    rows={2}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none resize-none"
                  />
                  <button onClick={() => saveAdminNote(detailBooking.id)} className="mt-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-sm font-medium rounded-lg transition-colors">
                    Lưu ghi chú
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {detailBooking.status === "pending" && (
                    <>
                      <button onClick={() => { updateStatus(detailBooking.id, "confirmed"); setDetailBooking({ ...detailBooking, status: "confirmed" }); }} className="flex-1 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg text-sm">✓ Xác nhận</button>
                      <button onClick={() => { updateStatus(detailBooking.id, "cancelled"); setDetailBooking({ ...detailBooking, status: "cancelled" }); }} className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold rounded-lg text-sm">✕ Hủy đơn</button>
                    </>
                  )}
                  {detailBooking.status === "confirmed" && (
                    <button onClick={() => { updateStatus(detailBooking.id, "completed"); setDetailBooking({ ...detailBooking, status: "completed" }); }} className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-lg text-sm">✓ Đánh dấu hoàn thành</button>
                  )}
                  <button onClick={() => togglePaid(detailBooking.id)} className={`flex-1 py-2.5 font-bold rounded-lg text-sm ${detailBooking.paid ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400" : "bg-green-500/20 hover:bg-green-500/30 text-green-400"}`}>
                    {detailBooking.paid ? "↩ Đánh dấu chưa TT" : "✓ Đánh dấu đã TT"}
                  </button>
                  <button onClick={() => deleteBooking(detailBooking.id)} className="px-4 py-2.5 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 font-bold rounded-lg text-sm transition-colors">🗑 Xóa</button>
                </div>

                <div className="text-xs text-zinc-600 text-center">
                  Tạo lúc: {new Date(detailBooking.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
