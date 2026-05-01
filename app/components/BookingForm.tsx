"use client";

import { useState } from "react";
import Image from "next/image";
import { combos } from "./data";
import { vouchers, applyVoucher } from "@/lib/vouchers";
import PaymentModal from "./PaymentModal";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00",
];

export default function BookingForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    comboId: "",
    bookingDate: "",
    bookingTime: "",
    playerCount: 2,
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    notes: "",
    voucherCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ id: string; totalPrice: number; paid: boolean } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [voucherApplied, setVoucherApplied] = useState<{ code: string; discount: number; finalPrice: number } | null>(null);
  const [voucherError, setVoucherError] = useState("");
  const [showVoucherList, setShowVoucherList] = useState(false);

  const selectedCombo = combos.find((c) => c.id === Number(formData.comboId));
  const originalPrice = selectedCombo ? selectedCombo.price : 0;
  const finalPrice = voucherApplied ? voucherApplied.finalPrice : originalPrice;

  const handleApplyVoucher = () => {
    setVoucherError("");
    if (!formData.voucherCode.trim()) return;
    const { discount, finalPrice: fp } = applyVoucher(formData.voucherCode, originalPrice);
    if (discount === 0) {
      const voucher = vouchers.find((v) => v.code.toUpperCase() === formData.voucherCode.toUpperCase());
      if (!voucher) setVoucherError("Mã voucher không hợp lệ");
      else if (originalPrice < voucher.minOrder) setVoucherError(`Đơn tối thiểu: ${voucher.minOrder.toLocaleString()}₫`);
      else setVoucherError("Voucher đã hết lượt sử dụng");
      setVoucherApplied(null);
    } else {
      setVoucherApplied({ code: formData.voucherCode.toUpperCase(), discount, finalPrice: fp });
    }
  };

  const handleSubmit = async (payAtCounter: boolean) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, voucherCode: voucherApplied?.code }),
      });
      const data = await res.json();
      if (data.success) {
        const comboNames: Record<number, string> = { 1: "Nintendo Switch", 2: "Xbox 360", 3: "PlayStation PS4" };
        const bookingData = {
          id: data.bookingId,
          comboName: comboNames[Number(formData.comboId)] || "Unknown",
          bookingDate: formData.bookingDate,
          bookingTime: formData.bookingTime,
          playerCount: formData.playerCount,
          guestName: formData.guestName,
          guestPhone: formData.guestPhone,
          totalPrice: finalPrice,
          status: payAtCounter ? "pending" : "pending",
          paid: false,
          createdAt: new Date().toISOString(),
        };
        const savedBookings = localStorage.getItem("joy-bookings") || "[]";
        const bookings = JSON.parse(savedBookings);
        bookings.unshift(bookingData);
        localStorage.setItem("joy-bookings", JSON.stringify(bookings));
        setBookingResult({ id: data.bookingId, totalPrice: finalPrice, paid: false });
        setStep(4);

        if (!payAtCounter) {
          setShowPayment(true);
        }
      } else {
        alert(data.error || "Đặt lịch thất bại!");
      }
    } catch {
      setBookingResult({ id: "BOOK-" + Date.now(), totalPrice: finalPrice, paid: false });
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canNext = () => {
    if (step === 1) return formData.comboId && formData.bookingDate && formData.bookingTime;
    if (step === 2) return formData.guestName && formData.guestPhone;
    return false;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">
            {step === 4 ? "✅ Đặt lịch thành công!" : "ĐẶT LỊCH COMBO"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        {step < 4 && (
          <div className="px-4 py-3">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-cyan-500" : "bg-zinc-700"}`} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>Chọn combo</span>
              <span>Thông tin</span>
              <span>Xác nhận</span>
            </div>
          </div>
        )}

        <div className="p-4">
          {/* Step 1: Choose Combo */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">Bước 1: Chọn combo</h3>

              <div className="space-y-3">
                {combos.map((combo) => (
                  <button
                    key={combo.id}
                    onClick={() => setFormData((f) => ({ ...f, comboId: String(combo.id) }))}
                    className={`w-full flex gap-3 p-3 rounded-xl border transition-all text-left ${
                      formData.comboId === String(combo.id)
                        ? "border-cyan-500 bg-cyan-500/10"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={combo.image} alt={combo.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{combo.name}</span>
                        {combo.popular && (
                          <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 text-xs rounded-full">Hot</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500 line-through">{combo.originalPrice.toLocaleString()}₫</span>
                        <span className="text-sm font-bold text-cyan-400">{combo.price.toLocaleString()}₫</span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-1 line-clamp-1">{combo.items.join(" • ")}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Date & Time */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Ngày đến</label>
                  <input
                    type="date"
                    value={formData.bookingDate}
                    onChange={(e) => setFormData((f) => ({ ...f, bookingDate: e.target.value }))}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Giờ đến</label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setFormData((f) => ({ ...f, bookingTime: time }))}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.bookingTime === time
                            ? "bg-cyan-500 text-black"
                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Guest Info */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">Bước 2: Thông tin liên hệ</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Họ tên *</label>
                  <input
                    type="text"
                    value={formData.guestName}
                    onChange={(e) => setFormData((f) => ({ ...f, guestName: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Số điện thoại *</label>
                  <input
                    type="tel"
                    value={formData.guestPhone}
                    onChange={(e) => setFormData((f) => ({ ...f, guestPhone: e.target.value }))}
                    placeholder="0912 345 678"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Email (không bắt buộc)</label>
                  <input
                    type="email"
                    value={formData.guestEmail}
                    onChange={(e) => setFormData((f) => ({ ...f, guestEmail: e.target.value }))}
                    placeholder="email@example.com"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Số người</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setFormData((f) => ({ ...f, playerCount: Math.max(1, f.playerCount - 1) }))}
                      className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center text-white text-xl"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-white w-8 text-center">{formData.playerCount}</span>
                    <button
                      onClick={() => setFormData((f) => ({ ...f, playerCount: Math.min(8, f.playerCount + 1) }))}
                      className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center text-white text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Ghi chú</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Yêu cầu đặc biệt..."
                    rows={2}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && selectedCombo && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">Bước 3: Xác nhận</h3>
              <div className="bg-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                    <Image src={selectedCombo.image} alt={selectedCombo.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{selectedCombo.name}</div>
                    <div className="text-sm text-zinc-400">{selectedCombo.items.join(" • ")}</div>
                  </div>
                </div>
                <div className="border-t border-zinc-700 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">📅 Ngày</span>
                    <span className="text-white">{formData.bookingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">🕐 Giờ</span>
                    <span className="text-white">{formData.bookingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">👤 Tên</span>
                    <span className="text-white">{formData.guestName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">📱 SĐT</span>
                    <span className="text-white">{formData.guestPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">👥 Số người</span>
                    <span className="text-white">{formData.playerCount}</span>
                  </div>
                </div>

                {/* Voucher section */}
                <div className="border-t border-zinc-700 pt-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.voucherCode}
                      onChange={(e) => { setFormData((f) => ({ ...f, voucherCode: e.target.value.toUpperCase() })); setVoucherError(""); }}
                      placeholder="Nhập mã voucher"
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                    />
                    <button onClick={handleApplyVoucher} className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-sm font-medium rounded-lg transition-colors">
                      Áp dụng
                    </button>
                    <button onClick={() => setShowVoucherList(!showVoucherList)} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-sm rounded-lg">
                      🎁
                    </button>
                  </div>
                  {voucherError && <p className="text-red-400 text-xs mt-1">{voucherError}</p>}
                  {voucherApplied && (
                    <div className="mt-2 flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                      <span className="text-green-400 text-sm">✓ {voucherApplied.code} (-{voucherApplied.discount.toLocaleString()}₫)</span>
                      <button onClick={() => { setVoucherApplied(null); setFormData((f) => ({ ...f, voucherCode: "" })); }} className="text-zinc-400 hover:text-white text-xs">✕</button>
                    </div>
                  )}
                  {showVoucherList && (
                    <div className="mt-2 space-y-2 bg-zinc-900 rounded-lg p-3">
                      <p className="text-xs text-zinc-500 mb-2">Voucher khả dụng:</p>
                      {vouchers.map((v) => (
                        <button key={v.code} onClick={() => { setFormData((f) => ({ ...f, voucherCode: v.code })); setShowVoucherList(false); }} className="w-full flex items-center justify-between text-left py-2 border-b border-zinc-800 last:border-0">
                          <div>
                            <span className="text-cyan-400 font-bold text-sm">{v.code}</span>
                            <span className="text-zinc-400 text-xs ml-2">{v.name}</span>
                          </div>
                          <span className="text-green-400 text-xs font-bold">
                            {v.type === "fixed" ? `-${v.discount.toLocaleString()}₫` : `-${v.discount}%`}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-zinc-700 pt-3 flex justify-between font-bold">
                  <span className="text-zinc-300">💰 Tổng tiền</span>
                  <div className="text-right">
                    {voucherApplied && (
                      <div className="text-xs text-zinc-500 line-through">{originalPrice.toLocaleString()}₫</div>
                    )}
                    <span className="text-cyan-400 text-lg">{finalPrice.toLocaleString()}₫</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-zinc-500 text-center">Chọn thanh toán tại quầy hoặc online</p>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && bookingResult && (
            <div className="text-center py-8 space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${bookingResult.paid ? "bg-green-500/20" : "bg-yellow-500/20"}`}>
                {bookingResult.paid ? (
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">
                {bookingResult.paid ? "Thanh toán thành công!" : "Đặt lịch thành công!"}
              </h3>
              <p className="text-zinc-400">Mã đặt chỗ của bạn:</p>
              <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <span className="text-cyan-400 font-mono font-bold text-lg">{bookingResult.id}</span>
              </div>
              <div className="text-zinc-400 text-sm">
                <p>Tổng tiền: <span className="text-white font-bold">{bookingResult.totalPrice.toLocaleString()}₫</span></p>
                {!bookingResult.paid && (
                  <p className="mt-2 text-yellow-400">⚠️ Vui lòng thanh toán tại quầy khi đến chơi.</p>
                )}
                <p className="mt-2">Vui lòng đến sớm 10 phút và mang theo mã đặt chỗ.</p>
              </div>
              <button onClick={onClose} className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all">
                Đóng
              </button>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        {step < 4 && (
          <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 p-4 flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
              >
                ← Quay lại
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold rounded-lg transition-all"
              >
                Tiếp tục →
              </button>
            ) : (
              <div className="flex-1 flex gap-2">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-50 text-black font-bold rounded-lg transition-all"
                >
                  💳 Thanh toán online
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                  className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-500 text-white font-bold rounded-lg transition-all"
                >
                  Tại quầy
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {bookingResult && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => { setShowPayment(false); }}
          amount={finalPrice}
          bookingId={bookingResult.id}
          onPaymentSuccess={() => {
            setShowPayment(false);
            setBookingResult({ ...bookingResult, paid: true });
            const savedBookings = localStorage.getItem("joy-bookings") || "[]";
            const bookings = JSON.parse(savedBookings);
            const updated = bookings.map((b: Record<string, string | boolean | number>) =>
              b.id === bookingResult.id ? { ...b, status: "confirmed", paid: true } : b
            );
            localStorage.setItem("joy-bookings", JSON.stringify(updated));
          }}
        />
      )}
    </div>
  );
}