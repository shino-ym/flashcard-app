"use client";

import { useState,useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/types/card";

export default function CardsCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const category = decodeURIComponent(String(params.category));

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("http://localhost/api/cards");
        if (!res.ok) {
          throw new Error("カード一覧の取得に失敗しました");
        }

        const data = await res.json();

        const normalizedCards: Card[] = data.map((card: Partial<Card>) => ({
          id: card.id ?? Date.now(),
          category: card.category ?? "",
          question: card.question ?? "",
          answer: card.answer ?? "",
          status:
            card.status === "mastered"
              ? "mastered"
              : "new",
        }));

        setCards(normalizedCards);
      } catch (error) {
        console.error("取得エラー:", error);
      }
    };

    fetchCards();
  }, []);

  const toggleMastered = async (id: number) => {
    const targetCard = cards.find((c) => c.id === id);
    if (!targetCard) return;

    const newStatus: Card["status"] =
      targetCard.status === "mastered" ? "new" : "mastered";

    try {
      const res = await fetch(`http://localhost/api/cards/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: targetCard.category,
          question: targetCard.question,
          answer: targetCard.answer,
          status: newStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("ステータス更新に失敗しました");
      }

      setCards((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: newStatus,
              }
            : c,
        ),
      );
    } catch (error) {
      console.error("更新エラー:", error);
    }
  };

  const deleteCard = async (id: number) => {
    try {
      const res = await fetch(`http://localhost/api/cards/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("削除に失敗しました");
      }

      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("削除エラー:", error);
    }
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
