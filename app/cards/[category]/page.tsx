"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/types/card";

export default function CardsCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const category = decodeURIComponent(String(params.category));

  const [cards, setCards] = useState<Card[]>(() => {
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

  const saveCards = (updatedCards: Card[]) => {
    setCards(updatedCards);
    localStorage.setItem("cards", JSON.stringify(updatedCards));
  };

  const toggleMastered = (id: number) => {
    const updatedCards: Card[] = cards.map((c) => {
      if (c.id !== id) return c;

      const newStatus: Card["status"] =
        c.status === "mastered" ? "new" : "mastered";

      return {
        ...c,
        status: newStatus,
      };
    });

    saveCards(updatedCards);
  };

  const deleteCard = (id: number) => {
    const remaining: Card[] = cards.filter((c) => c.id !== id);
    saveCards(remaining);
  };
    
    const filteredCards = cards.filter(
      (card) =>
        card.category.trim().toLowerCase() === category.trim().toLowerCase(),
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-pink-500">
          {category}の問題一覧
        </h1>

        {filteredCards.length === 0 && (
          <p className="text-center text-gray-500">問題がありません</p>
        )}

        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-3xl shadow-md p-5 space-y-3"
          >
            <div>
              <p className="text-lg text-center font-semibold">
                {card.question}
              </p>
            </div>

            <div className="flex justify-center gap-3 text-center">
              <button
                className="bg-pink-100 hover:bg-pink-200 px-4 py-2 rounded-2xl"
                onClick={() => router.push(`/edit/${card.id}`)}
              >
                編集
              </button>
              <button
                className="bg-green-100 hover:bg-green-200 px-4 py-2 rounded-2xl"
                onClick={() => toggleMastered(card.id)}
              >
                {card.status === "mastered" ? "未習得に戻す" : "覚えた"}
              </button>
              <button
                className="bg-red-100 hover:bg-red-200 px-4 py-2 rounded-2xl"
                onClick={() => deleteCard(card.id)}
              >
                削除
              </button>
            </div>
          </div>
        ))}

        <button
          className="block mx-auto bg-purple-100 hover:bg-purple-200 px-4 py-2 rounded-2xl"
          onClick={() => router.push(`/study/${category}`)}
        >
          このカテゴリーを勉強する
        </button>

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
