"use client";

import { useState,useEffect } from "react";
import Link from "next/link";
import { Card } from "@/types/card";

export default function Home() {
const [cards, setCards] = useState<Card[]>([]);

useEffect(() => {
  const fetchCards = async () => {
    const res = await fetch("http://localhost/api/cards");
    const data = await res.json();

    setCards(data);
  };

  fetchCards();
}, []);
  const categories = Array.from(new Set(cards.map((c) => c.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-pink-500">
          Flashcard App
        </h1>
        <p className="text-center text-gray-500 text-sm">
          AIで答えを生成して、そのまま学習できる！
        </p>

        <div className="bg-white rounded-3xl shadow-md p-5 space-y-4">
          <h2 className="text-center text-lg font-semibold text-gray-800">
            カテゴリーから学習
          </h2>

          <div className="space-y-3">
            <Link
              href="/study/all"
              className="block w-full text-center bg-pink-100 hover:bg-pink-200 py-3 rounded-2xl transition"
            >
              すべて
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/study/${cat}`}
                className="block w-full text-center bg-pink-100 hover:bg-pink-200 py-3 rounded-2xl transition"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/add"
          className="block text-center bg-pink-400 hover:bg-pink-500 text-white font-semibold px-8 py-3 rounded-2xl transition"
        >
          問題を追加
        </Link>

        <Link
          href="/cards"
          className="block text-center bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-2xl transition"
        >
          問題一覧を見る
        </Link>

      </main>
    </div>
  );
}
