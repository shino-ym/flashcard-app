"use client";

import { useState,useEffect } from "react";
import Link from "next/link";
import { Card } from "@/types/card";

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      const res = await fetch("http://localhost/api/cards");
      const data = await res.json();

      setCards(data);
    };

    fetchCards();
  }, []);

  const categories = Array.from(
    new Set(cards.map((c) => c.category).filter((cat) => cat.trim() !== "")),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-pink-500">
          カテゴリー別問題一覧
        </h1>

        {categories.length === 0 && (
          <p className="text-center text-gray-500">カテゴリーがありません</p>
        )}
        <div className="space-y-3">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/cards/${cat}`}
              className="block text-center bg-pink-100 hover:bg-pink-200 py-3 rounded-2xl transition"
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
