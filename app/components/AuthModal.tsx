"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean; onClose: () => void; onLoginSuccess?: () => void }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isLogin) {
      const ok = await login(email, password);
      if (ok) { if (onLoginSuccess) onLoginSuccess(); else { onClose(); reset(); } }
      else setError("Sai email hoặc mật khẩu");
    } else {
      if (!name || !email || !phone || !password) { setError("Vui lòng điền đầy đủ"); setLoading(false); return; }
      const ok = await register(name, email, phone, password);
      if (ok) { if (onLoginSuccess) onLoginSuccess(); else { onClose(); reset(); } }
      else setError("Email đã được đăng ký");
    }
    setLoading(false);
  };

  const reset = () => { setName(""); setEmail(""); setPhone(""); setPassword(""); setError(""); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
          <button onClick={onClose} className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Họ tên</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none" />
            </div>
          )}
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none" />
          </div>
          {!isLogin && (
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Số điện thoại</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912 345 678" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none" />
            </div>
          )}
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none" />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-700 text-black font-bold rounded-lg transition-all">
            {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors">
            {isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
}