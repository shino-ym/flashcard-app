"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/types/card";

export default function CardsPage() {
  const [cards] = useState<Card[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("cards");
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed.map((card): Card => {
      const item = card as Partial<Card>;

      return {
        id: item.id ?? Date.now(),
        category: item.category ?? "",
        question: item.question ?? "",
        answer: item.answer ?? "",
        status: item.status === "mastered" ? "mastered" : "new",
      };
    });
  });

  const categories = Array.from(
    new Set(cards.map((c) => c.category).filter((cat) => cat.trim() !== "")),
  );

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-md p-6 space-y-5">
        <h1 className="text-2xl font-bold text-center text-pink-500">
          カテゴリー別問題一覧
        </h1>

        {categories.length === 0 && (
          <p className="text-center text-gray-500">カテゴリーがありません</p>
        )}

        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/cards/${cat}`}
            className="block text-center bg-pink-100 hover:bg-pink-200 py-3 rounded-2xl transition"
          >
            {cat}
          </Link>
        ))}

        <Link
          href="/"
          className="block text-center text-pink-500 hover:underline"
        >
          HOMEへ戻る
        </Link>
      </div>
    </div>
  );
}
