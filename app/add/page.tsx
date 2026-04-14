"use client";

import { useState } from "react";
import Link from "next/link";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(";").shift()!);
  }
  return null;
}

export default function AddPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

  const handleGenerateAnswer = async () => {
    if (!question.trim()) return;

    try {
      setIsGenerating(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "AI生成に失敗しました");
        return;
      }

      setAnswer(data.answer);

    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!category.trim() || !question.trim() || !answer.trim()) return;

    try {
      setIsSaving(true);

      const csrfRes = await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      if (!csrfRes.ok) {
        alert("CSRF Cookie取得に失敗しました");
        return;
      }

      const xsrfToken = getCookie("XSRF-TOKEN");

      if (!xsrfToken) {
        alert("XSRF-TOKENが取得できません");
        return;
      }

      const res = await fetch(
        `${API_BASE}/api/cards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": xsrfToken,
          },
          credentials: "include",
          body: JSON.stringify({
            category,
            question,
            answer,
            status: "new",
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "保存に失敗しました");
        return;
      }

      setQuestion("");
      setAnswer("");
      setCategory("");

    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました");
    } finally {
      setIsSaving(false);
    }

    setMessage("保存しました！");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md space-y-6 px-4 py-6">
        <h1 className="text-center text-3xl font-bold text-pink-500">
          問題追加
        </h1>

        <div className="space-y-4 rounded-3xl bg-white p-5 shadow-md">
          <p className="mb-3 text-1xl font-bold">問題</p>
          <input
            className="w-full rounded-2xl border border-pink-200 p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="問題を入力"
          />

          <button
            className="block rounded-3xl bg-pink-100 px-4 py-4 text-center transition hover:bg-pink-200 disabled:opacity-50"
            onClick={handleGenerateAnswer}
            disabled={isGenerating}
          >
            {isGenerating
              ? "生成中..."
              : answer
                ? "もう一度生成"
                : "AIで答え生成"}
          </button>

          <p className="mb-3 text-1xl font-bold">答え</p>
          <textarea
            className="min-h-[120px] w-full rounded-2xl border border-pink-200 p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="答えを入力"
          />

          <p className="mb-3 text-1xl font-bold">カテゴリー</p>
          <input
            className="w-full rounded-2xl border border-pink-200 p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="カテゴリーを入力"
          />

          <button
            className="w-full rounded-2xl bg-rose-500 py-3 font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "保存中..." : "保存"}
          </button>
        </div>

        {message && (
          <p className="lock text-center rounded-xl bg-gray-100 p-3 text-sm">
            {message}
          </p>
        )}

        <Link
          href="/cards"
          className="block rounded-2xl bg-pink-100 py-3 text-center transition hover:bg-pink-200"
        >
          問題一覧を見る
        </Link>

        <Link
          href="/"
          className="block text-center text-pink-500 hover:underline"
        >
          トップへ戻る
        </Link>
      </main>
    </div>
  );
}
