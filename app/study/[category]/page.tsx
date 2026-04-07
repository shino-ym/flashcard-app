"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/types/card";

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const category = decodeURIComponent(String(params.category));

  const [cards, setCards] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    try {
      const res = await fetch("http://localhost/api/cards");

      if (!res.ok) {
        throw new Error("カード取得に失敗しました");
      }

      const data = await res.json();

      const normalizedCards: Card[] = data.map((card: Partial<Card>) => ({
        id: card.id ?? Date.now(),
        category: card.category ?? "",
        question: card.question ?? "",
        answer: card.answer ?? "",
        status: card.status === "mastered" ? "mastered" : "new",
      }));

      setCards(normalizedCards);
    } catch (error) {
      console.error("取得エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const filteredCards =
    category.toLowerCase() === "all"
      ? cards.filter((card) => card.status !== "mastered")
      : cards.filter(
          (card) =>
            card.category.toLowerCase() === category.toLowerCase() &&
            card.status !== "mastered",
        );

  const safeIndex = index >= filteredCards.length ? 0 : index;
  const card = filteredCards[safeIndex];

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % filteredCards.length);
    setShowAnswer(false);
  };

  const prevCard = () => {
    setIndex((prev) => (prev === 0 ? filteredCards.length - 1 : prev - 1));
    setShowAnswer(false);
  };

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
          question: targetCard.question,
          answer: targetCard.answer,
          category: targetCard.category,
          status: newStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("更新に失敗しました");
      }

      await fetchCards();

      if (safeIndex >= filteredCards.length - 1 && filteredCards.length > 1) {
        setIndex(0);
      }

      setShowAnswer(false);
    } catch (error) {
      console.error("更新エラー:", error);
      alert("更新に失敗しました");
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

      await fetchCards();

      if (safeIndex >= filteredCards.length - 1 && filteredCards.length > 1) {
        setIndex(0);
      }

      setShowAnswer(false);
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto w-full max-w-md px-4 py-6">
          <p className="text-center text-gray-500">読み込み中...</p>
        </main>
      </div>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto w-full max-w-md px-4 py-6 space-y-6">
          <h1 className="text-3xl font-bold text-center text-pink-500">
            学習ページ
          </h1>

          <p className="text-center text-gray-500">
            {category} の学習問題がありません
          </p>

          <Link
            href="/cards"
            className="block text-center bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-2xl transition"
          >
            問題一覧を見る
          </Link>
          <Link href="/" className="block text-pink-500 hover:underline">
            トップへ戻る
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md px-4 py-6 space-y-6">
        <p className="text-sm text-pink-400 font-medium text-center">
          カテゴリー: {category}
        </p>

        <div className="bg-white rounded-3xl shadow-md p-5 space-y-4">
          <h1 className="text-3xl font-bold text-center text-gray-800 leading-relaxed">
            {card.question}
          </h1>

          {showAnswer && (
            <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4">
              <p className="whitespace-pre-line text-gray-700">{card.answer}</p>
            </div>
          )}

          <button
            className="block mx-auto text-center bg-pink-400 hover:bg-pink-500 text-white font-semibold px-8 py-3 rounded-2xl transition"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? "答えを隠す" : "答えを見る"}
          </button>

          <button
            className="block mx-auto text-center bg-green-100 hover:bg-green-200 text-gray-700 font-medium px-4 py-3 rounded-2xl transition"
            onClick={() => toggleMastered(card.id)}
          >
            {card.status === "mastered" ? "未習得に戻す" : "💡覚えた！"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          {safeIndex + 1} / {filteredCards.length}
        </p>

        <div className="flex gap-3 justify-center">
          {filteredCards.length > 1 && (
            <button
              className="bg-pink-100 hover:bg-pink-200 px-6 py-3 rounded-2xl transition"
              onClick={prevCard}
            >
              前へ
            </button>
          )}

          <button
            className="bg-pink-100 hover:bg-pink-200 px-6 py-3 rounded-2xl transition"
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
          トップへ戻る
        </Link>
      </main>
    </div>
  );
}
