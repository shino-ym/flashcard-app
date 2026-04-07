"use client";

import { useState } from "react";
import Link from "next/link";

export default function AddPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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
      const res = await fetch("http://localhost/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          answer,
          category,
          status: "new",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("保存に失敗しました");
        console.error(data);
        return;
      }

      setQuestion("");
      setAnswer("");
      setCategory("");
      alert("保存しました");
    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-pink-500">
          問題追加
        </h1>

        <div>
          <p className="mb-3 text-1xl font-bold">問題</p>
          <input
            className="w-full border border-pink-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="問題を入力"
          />
        </div>

        <div>
          <button
            className="block text-center bg-pink-100 hover:bg-pink-200 px-4 py-4 rounded-3xl transition"
            onClick={handleGenerateAnswer}
            disabled={isGenerating}
          >
            {isGenerating
              ? "生成中..."
              : answer
                ? "もう一度生成"
                : "AIで答え生成"}
          </button>
        </div>

        <div>
          <p className="mb-3 text-1xl font-bold">答え</p>
          <textarea
            className="w-full border border-pink-200 rounded-2xl p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="答えを入力"
          />
        </div>

        <div>
          <p className="mb-3 text-1xl font-bold">カテゴリー</p>
          <input
            className="w-full border border-pink-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="カテゴリーを入力"
          />
        </div>

        <button
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-2xl transition"
          onClick={handleSave}
        >
          保存
        </button>

        <Link
          href="/cards"
          className="block text-center bg-pink-100 hover:bg-pink-200 py-3 rounded-2xl transition"
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
