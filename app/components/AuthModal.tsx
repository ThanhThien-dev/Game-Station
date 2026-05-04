"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { GOOGLE_CLIENT_ID } from "@/lib/google-oauth";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean; onClose: () => void; onLoginSuccess?: () => void }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError("Chưa cấu hình Google Client ID. Liên hệ admin để thiết lập.");
      return;
    }
    // Redirect to Google OAuth with callback
    const callback = encodeURIComponent(window.location.pathname);
    window.location.href = `/api/auth/google?callback=${callback}`;
  };

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

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={!GOOGLE_CLIENT_ID}
          className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-gray-100 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-gray-700 font-medium rounded-lg transition-all mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {!GOOGLE_CLIENT_ID ? "Chưa cấu hình Google" : "Tiếp tục với Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-zinc-700" />
          <span className="text-xs text-zinc-500">hoặc</span>
          <div className="flex-1 h-px bg-zinc-700" />
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
