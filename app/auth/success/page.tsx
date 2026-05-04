"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const userStr = searchParams.get("user");
      const callback = searchParams.get("callback") || "/";

      if (!userStr) {
        setError("Không nhận được thông tin user");
        setTimeout(() => router.push("/"), 2000);
        return;
      }

      const user = JSON.parse(decodeURIComponent(userStr));

      localStorage.setItem("joy-user", JSON.stringify(user));

      const usersStr = localStorage.getItem("joy-users") || "[]";
      const users = JSON.parse(usersStr);
      if (!users.find((u: Record<string, string>) => u.email === user.email)) {
        users.push({ name: user.name, email: user.email, phone: "", password: "" });
        localStorage.setItem("joy-users", JSON.stringify(users));
      }

      window.dispatchEvent(new Event("storage"));

      router.push(callback);
    } catch {
      setError("Lỗi xử lý đăng nhập");
      setTimeout(() => router.push("/"), 2000);
    }
  }, [router, searchParams]);

  return (
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
      {error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <p className="text-zinc-400">Đang hoàn tất đăng nhập...</p>
      )}
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Đang tải...</p>
        </div>
      }>
        <AuthSuccessContent />
      </Suspense>
    </main>
  );
}
