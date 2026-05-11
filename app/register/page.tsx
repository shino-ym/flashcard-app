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
    setMessage("登録中...");

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (data?.errors) {
          const firstError = Object.values(data.errors)[0] as string[];
          setMessage(firstError[0]);
        } else {
          setMessage(data?.message || "登録失敗");
        }

        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("登録成功");
      router.push("/");
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

        <h2 className="mb-6 text-center text-2xl font-bold">新規登録</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">メールアドレス</label>

            <input
              type="email"
              className="w-full rounded-xl border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">パスワード</label>
            <input
              type="password"
              className="w-full rounded-xl border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

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
        </div>
      </main>
    </div>
  );
}
