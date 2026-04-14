"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

  const handleRegister = async () => {
    try {
      const csrfRes = await fetch(
        `${API_BASE}/sanctum/csrf-cookie`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!csrfRes.ok) {
        setMessage("CSRF Cookie取得に失敗");
        return;
      }

      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "登録失敗");
        return;
      }

      setMessage("登録成功！ログインしてください");

      // ログイン画面へ
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("通信エラー");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md px-4 py-10 space-y-4">
        <h1 className="text-center text-3xl font-bold text-pink-500">
          Flashcard App
        </h1>

        <h2 className="text-2xl font-bold text-center">新規登録</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="メール"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-pink-400 text-white py-2 rounded"
        >
          登録
        </button>

        {message && <p className="text-center text-sm">{message}</p>}

        <Link
          href="/login"
          className="block text-center text-blue-500 hover:underline"
        >
          ログインはこちら
        </Link>
      </main>
    </div>
  );
}
