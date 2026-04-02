"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/types/card";

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const category = String(params.category);

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

  const filteredCards =
    category.toLowerCase() === "all"
      ? cards.filter((card) => card.status !== "mastered")
      : cards.filter(
          (card) =>
            card.category.toLowerCase() === category.toLowerCase() &&
            card.status !== "mastered",
        );
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (filteredCards.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-md p-6 space-y-5 text-center">
          <h1 className="text-xl font-bold text-pink-500">学習ページ</h1>
          <p className="text-gray-600">{category} の学習問題がありません</p>

          <Link
            href="/cards"
            className="block text-center bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-2xl transition"
          >
            カード一覧を見る
          </Link>
          <Link href="/" className="block text-pink-500 hover:underline">
            HOMEへ戻る
          </Link>
        </div>
      </div>
    );
  }

  const safeIndex = index >= filteredCards.length ? 0 : index;
  const card = filteredCards[safeIndex];

  const saveCards = (updatedCards: Card[]) => {
    setCards(updatedCards);
    localStorage.setItem("cards", JSON.stringify(updatedCards));
  };

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % filteredCards.length);
    setShowAnswer(false);
  };

  const prevCard = () => {
    setIndex((prev) => (prev === 0 ? filteredCards.length - 1 : prev - 1));
    setShowAnswer(false);
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

    if (safeIndex >= filteredCards.length - 1 && filteredCards.length > 1) {
      setIndex(0);
    }

    setShowAnswer(false);
  };

  const deleteCard = (id: number) => {
    const updatedCards = cards.filter((c) => c.id !== id);
    saveCards(updatedCards);

    if (safeIndex >= filteredCards.length - 1 && filteredCards.length > 1) {
      setIndex(0);
    }

    setShowAnswer(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-md p-6 space-y-5">
        <p className="text-sm text-pink-400 font-medium text-center">
          カテゴリー: {category}
        </p>

        <h1 className="text-2xl font-bold text-center text-gray-800 leading-relaxed">
          {card.question}
        </h1>

        {showAnswer && (
          <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4">
            <p className="whitespace-pre-line text-gray-700">{card.answer}</p>
          </div>
        )}

        <button
          className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 rounded-2xl transition"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {showAnswer ? "答えを隠す" : "答えを見る"}
        </button>

        <button
          className="w-full bg-green-100 hover:bg-green-200 text-gray-700 font-medium py-3 rounded-2xl transition"
          onClick={() => toggleMastered(card.id)}
        >
          {card.status === "mastered" ? "未習得に戻す" : "覚えた"}
        </button>

        <p className="text-center text-sm text-gray-500">
          {safeIndex + 1} / {filteredCards.length}
        </p>

        <div className="flex gap-3">
          {filteredCards.length > 1 && (
            <button
              className="flex-1 bg-pink-100 hover:bg-pink-200 py-3 rounded-2xl transition"
              onClick={prevCard}
            >
              前へ
            </button>
          )}

          <button
            className="flex-1 bg-pink-100 hover:bg-pink-200 py-3 rounded-2xl transition"
            onClick={nextCard}
          >
            次へ
          </button>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            className="text-sm text-gray-400 hover:text-gray-600"
            onClick={() => router.push(`/edit/${card.id}`)}
          >
            編集
          </button>

          <button
            className="text-sm text-gray-400 hover:text-gray-600"
            onClick={() => deleteCard(card.id)}
          >
            削除
          </button>
        </div>
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
