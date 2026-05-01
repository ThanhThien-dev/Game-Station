"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bookingId: string;
  onPaymentSuccess: () => void;
}

const paymentMethods = [
  { id: "momo", name: "Ví MoMo", icon: "💜", color: "from-purple-600 to-pink-500", qrImage: "/images/QR Momo.jpg", qrBg: "bg-purple-500/5" },
  { id: "banking", name: "Chuyển khoản ngân hàng", icon: "🏦", color: "from-blue-600 to-cyan-500", qrImage: "/images/QR Techcombank.jpg", qrBg: "bg-blue-500/5" },
];

export default function PaymentModal({ isOpen, onClose, amount, bookingId, onPaymentSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [step, setStep] = useState<"select" | "qr" | "verifying" | "success">("select");
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [verifyStep, setVerifyStep] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedMethod("");
      setStep("select");
      setVerifyProgress(0);
      setVerifyStep("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selected = paymentMethods.find((m) => m.id === selectedMethod);

  const handleVerifyPayment = () => {
    setStep("verifying");
    setVerifyProgress(0);

    const steps = [
      { progress: 15, text: "Đang kết nối đến máy chủ...", delay: 400 },
      { progress: 30, text: `Đang kiểm tra giao dịch từ ${selected?.name}...`, delay: 800 },
      { progress: 50, text: "Đang xác minh số tiền...", delay: 1200 },
      { progress: 70, text: "Đang đối chiếu với đơn đặt...", delay: 1600 },
      { progress: 85, text: "Đang hoàn tất xử lý...", delay: 2000 },
      { progress: 100, text: "Giao dịch thành công!", delay: 2400 },
    ];

    steps.forEach(({ progress, text, delay }) => {
      setTimeout(() => {
        setVerifyProgress(progress);
        setVerifyStep(text);
        if (progress === 100) {
          const savedPayments = localStorage.getItem("joy-payments") || "[]";
          const payments = JSON.parse(savedPayments);
          payments.push({
            bookingId,
            method: selected?.id,
            amount,
            status: "paid",
            timestamp: new Date().toISOString(),
          });
          localStorage.setItem("joy-payments", JSON.stringify(payments));
          setTimeout(() => setStep("success"), 500);
          setTimeout(() => onPaymentSuccess(), 2000);
        }
      }, delay);
    });
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {step === "success" ? "✅ Thanh toán thành công!" : "💳 Thanh toán"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step 1: Select Method */}
        {step === "select" && (
          <div className="p-4 space-y-4">
            <div className="bg-zinc-800 rounded-xl p-4 text-center">
              <div className="text-sm text-zinc-400 mb-1">Tổng thanh toán</div>
              <div className="text-3xl font-black text-cyan-400">{amount.toLocaleString()}₫</div>
              <div className="text-xs text-zinc-500 mt-1">Mã đặt: {bookingId}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Chọn phương thức</label>
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    selectedMethod === method.id
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center text-lg`}>
                    {method.icon}
                  </div>
                  <span className="font-medium text-white">{method.name}</span>
                  {selectedMethod === method.id && (
                    <div className="ml-auto w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("qr")}
              disabled={!selectedMethod}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 disabled:bg-zinc-700 disabled:opacity-50 text-black font-bold rounded-lg transition-all"
            >
              Tạo mã QR
            </button>
          </div>
        )}

        {/* Step 2: Show QR Code */}
        {step === "qr" && selected && (
          <div className="p-6 text-center space-y-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${selected.color} text-black font-bold text-sm`}>
              {selected.icon} {selected.name}
            </div>

            {/* Amount */}
            <div className="text-2xl font-black text-white">{amount.toLocaleString()}₫</div>

            {/* QR Code Image */}
            <div className={`${selected.qrBg} border-2 border-zinc-700 rounded-2xl p-4 inline-block`}>
              <div className="w-56 h-56 relative rounded-lg overflow-hidden bg-white">
                <Image
                  src={selected.qrImage}
                  alt={`QR ${selected.name}`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="text-sm text-zinc-400">
              <p>📱 Mở app <span className="text-white font-medium">{selected.name}</span> và quét mã QR</p>
              <p className="text-xs text-zinc-500 mt-1">Hoặc chuyển khoản ghi nội dung: <span className="text-cyan-400 font-mono">{bookingId}</span></p>
            </div>

            <div className="bg-zinc-800 rounded-lg p-3 text-left">
              <div className="text-xs text-zinc-500 mb-1">Hướng dẫn:</div>
              <ul className="text-xs text-zinc-300 space-y-1">
                <li>1. Mở app ngân hàng hoặc {selected.name}</li>
                <li>2. Quét mã QR hoặc chuyển khoản</li>
                <li>3. Ghi nội dung: <span className="text-cyan-400">{bookingId}</span></li>
                <li>4. Nhấn "Tôi đã thanh toán" bên dưới</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep("select")}
                className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
              >
                ← Đổi phương thức
              </button>
              <button
                onClick={handleVerifyPayment}
                className="flex-1 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition-all"
              >
                ✓ Tôi đã thanh toán
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Verifying Payment */}
        {step === "verifying" && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Đang xác minh giao dịch...</h3>
              <p className="text-zinc-400 text-sm">{verifyStep}</p>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div className="bg-cyan-500 h-2 rounded-full transition-all duration-300" style={{ width: `${verifyProgress}%` }} />
            </div>
            <div className="text-xs text-zinc-500">
              Vui lòng không đóng trang này cho đến khi xác minh hoàn tất
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Thanh toán thành công!</h3>
            <p className="text-zinc-400 text-sm">Hẹn gặp bạn tại Joy Station 🎮</p>
          </div>
        )}
      </div>
    </div>
  );
}