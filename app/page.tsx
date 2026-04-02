"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/types/card";

export default function Home() {
  const [cards] = useState<Card[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : [];
  });

  const categories = Array.from(new Set(cards.map((c) => c.category)));

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-md p-6 space-y-5">
        <h1 className="text-2xl font-bold text-center text-pink-500">ホーム</h1>

        <Link
          href="/add"
          className="block text-center bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 rounded-2xl transition"
        >
          カードを追加
        </Link>

        <div className="bg-white rounded-3xl shadow-md p-5 space-y-3">
          <h2 className="text-lg font-semibold mb-3">カテゴリーから学習</h2>

          <div className="space-y-2">
            <Link
              href="/study/all"
              className="block text-center bg-pink-100 hover:bg-pink-200 py-3 rounded-2xl transition"
            >
              すべて
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/study/${cat}`}
                className="block text-center bg-pink-100 hover:bg-pink-200 py-3 rounded-2xl transition"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/cards"
          className="block text-center bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-2xl transition"
        >
          カード一覧を見る
        </Link>
      </div>
    </div>
  );
}
