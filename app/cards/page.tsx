"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/types/card";

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [message, setMessage] = useState("読み込み中...");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cards`, {
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
  }, [API_BASE]);

  const categories = Array.from(
    new Set(cards.map((c) => c.category).filter((cat) => cat.trim() !== "")),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md space-y-6 px-4 py-6">
        <h1 className="text-center text-3xl font-bold text-pink-500">
          カテゴリー別問題一覧
        </h1>

        {message && <p className="text-center text-gray-500">{message}</p>}

        <div className="space-y-4 rounded-3xl bg-white p-5 shadow-md">
          <Link
            href="/cards/all"
            className="block w-full rounded-2xl bg-pink-100 py-3 text-center transition hover:bg-pink-200"
          >
            すべて
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/cards/${cat}`}
              className="block rounded-2xl bg-pink-100 py-3 text-center transition hover:bg-pink-200"
            >
              {cat}
            </Link>
          ))}
        </div>

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
