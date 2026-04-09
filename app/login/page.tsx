"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(";").shift()!);
  }
  return null;
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setMessage("ログイン中...");

    try {
      const csrfRes = await fetch("http://localhost/sanctum/csrf-cookie", {
        method: "GET",
        credentials: "include",
      });

      if (!csrfRes.ok) {
        setMessage("CSRF Cookie取得に失敗");
        return;
      }

      const xsrfToken = getCookie("XSRF-TOKEN");

      if (!xsrfToken) {
        setMessage("XSRF-TOKENが取得できません");
        return;
      }

      const loginRes = await fetch("http://localhost/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setMessage(loginData.message || "ログイン失敗");
        return;
      }

      const userRes = await fetch("http://localhost/api/user", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      });

      const userData = await userRes.json();

      if (!userRes.ok) {
        setMessage(userData.message || "ユーザー取得失敗");
        return;
      }

      setMessage(`ログイン成功: ${userData.name}`);

      router.push("/");
    } catch (error) {
      console.error("login error:", error);
      setMessage("通信エラーかCORSエラーの可能性があります");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md px-4 py-10">
        <h1 className="text-center text-3xl font-bold text-pink-500">
          Flashcard App
        </h1>

        <h2 className="mb-6 text-center text-2xl font-bold">ログイン</h2>

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
            onClick={handleLogin}
            className="w-full rounded-2xl bg-pink-100 px-4 py-3 hover:bg-pink-200"
          >
            ログインする
          </button>

          {message && (
            <p className="rounded-xl bg-gray-100 p-3 text-sm">{message}</p>
          )}

          <Link
            href="/register"
            className="block
              text-center
              text-blue-500
              hover:"
          >
            新規登録はこちら
          </Link>
        </div>
      </main>
    </div>
  );
}
