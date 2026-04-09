"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/types/card";

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [message, setMessage] = useState("読み込み中...");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("http://localhost/api/cards", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "カード取得失敗");
          return;
        }

        setCards(data);
        setMessage("");
      } catch (error) {
        console.error(error);
        setMessage("通信エラーが発生しました");
      }
    };

    fetchCards();
  }, []);

  const categories = Array.from(
    new Set(cards.map((c) => c.category).filter((cat) => cat.trim() !== "")),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md space-y-6 px-4 py-6">
        <h1 className="text-center text-3xl font-bold text-pink-500">
          Flashcard App
        </h1>

        <p className="text-center text-sm text-gray-500">
          AIで答えを生成して、そのまま学習できる！
        </p>

        {message && <p className="text-center text-gray-500">{message}</p>}

        <div className="space-y-4 rounded-3xl bg-white p-5 shadow-md">
          <h2 className="text-center text-lg font-semibold text-gray-800">
            カテゴリーから学習
          </h2>

          <div className="space-y-3">
            <Link
              href="/study/all"
              className="block w-full rounded-2xl bg-pink-100 py-3 text-center transition hover:bg-pink-200"
            >
              すべて
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/study/${cat}`}
                className="block w-full rounded-2xl bg-pink-100 py-3 text-center transition hover:bg-pink-200"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/add"
          className="block rounded-2xl bg-pink-400 px-8 py-3 text-center font-semibold text-white transition hover:bg-pink-500"
        >
          問題を追加
        </Link>

        <Link
          href="/cards"
          className="block rounded-2xl bg-rose-500 py-3 text-center font-semibold text-white transition hover:bg-rose-600"
        >
          問題一覧を見る
        </Link>
      </main>
    </div>
  );
}
