"use client";

import { useState, useEffect } from "react";
import { Card } from "@/types/card";
import Link from "next/link";

export default function AddPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [categories, setCategories] = useState<string[]>([]);

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
    const finalCategory = newCategory.trim() || selectedCategory;

    if (!finalCategory || !question.trim() || !answer.trim()) return;

    try {
      setIsSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("ログインしてください");
        return;
      }

      const res = await fetch(`${API_BASE}/api/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: finalCategory,
          question,
          answer,
          status: "new",
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "保存に失敗しました");
        return;
      }

      if (newCategory.trim() && !categories.includes(newCategory.trim())) {
        setCategories([...categories, newCategory.trim()]);
      }

      setQuestion("");
      setAnswer("");
      setSelectedCategory("");
      setNewCategory("");
      setMessage("保存しました！");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await fetch(`${API_BASE}/api/cards`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = (await res.json().catch(() => null)) as Card[] | null;

        if (!res.ok || !data) return;

        const uniqueCategories: string[] = Array.from(
          new Set(
            data
              .map((card: { category: string }) => card.category)
              .filter((cat: string) => cat.trim() !== ""),
          ),
        );

        setCategories(uniqueCategories);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, [API_BASE]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md space-y-6 px-4 py-6">
        <h1 className="text-center text-3xl font-bold text-pink-500">
          問題追加
        </h1>

        <div className="space-y-4 rounded-3xl bg-white p-5 shadow-md">
          <p className="font-bold">問題</p>

          <input
            className="w-full rounded-2xl border border-pink-200 p-3"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="問題を入力"
          />

          <button
            className="block rounded-3xl bg-pink-100 px-4 py-4 hover:bg-pink-200 disabled:opacity-50"
            onClick={handleGenerateAnswer}
            disabled={isGenerating}
          >
            {isGenerating
              ? "生成中..."
              : answer
                ? "もう一度生成"
                : "AIで答え生成"}
          </button>

          <p className="font-bold">答え</p>

          <textarea
            className="min-h-[120px] w-full rounded-2xl border border-pink-200 p-3"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="答えを入力"
          />

          <p className="font-bold">カテゴリー</p>

          <select
            className="w-full rounded-2xl border border-pink-200 p-3"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">既存カテゴリを選ぶ</option>

            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            className="w-full rounded-2xl border border-pink-200 p-3"
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="新しいカテゴリを入力"
          />

          <button
            className="w-full rounded-2xl bg-rose-500 py-3 font-semibold text-white hover:bg-rose-600 disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "保存中..." : "保存"}
          </button>
        </div>

        {message && (
          <p className="rounded-xl bg-gray-100 p-3 text-center text-sm">
            {message}
          </p>
        )}

        <Link
          href="/cards"
          className="block rounded-2xl bg-purple-400 py-3 text-center text-white  font-semibold hover:bg-purple-500"
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
