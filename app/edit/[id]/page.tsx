"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/types/card";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = Number(params.id);

  const [targetCard, setTargetCard] = useState<Card | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("http://localhost/api/cards");

        if (!res.ok) {
          throw new Error("カード取得に失敗しました");
        }

        const data = await res.json();

        const foundCard = data.find((card: Card) => card.id === cardId);

        if (!foundCard) {
          setLoading(false);
          return;
        }

        const normalizedCard: Card = {
          id: foundCard.id,
          category: foundCard.category ?? "",
          question: foundCard.question ?? "",
          answer: foundCard.answer ?? "",
          status: foundCard.status === "mastered" ? "mastered" : "new",
        };

        setTargetCard(normalizedCard);
        setQuestion(normalizedCard.question);
        setAnswer(normalizedCard.answer);
        setCategory(normalizedCard.category);
      } catch (error) {
        console.error("取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [cardId]);

  const handleSave = async () => {
    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();
    const trimmedCategory = category.trim();

    if (!trimmedQuestion || !trimmedAnswer || !trimmedCategory || !targetCard) {
      return;
    }

    try {
      const res = await fetch(`http://localhost/api/cards/${cardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          answer: trimmedAnswer,
          category: trimmedCategory,
          status: targetCard.status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("更新に失敗しました");
        console.error(data);
        return;
      }

      router.push(`/cards/${encodeURIComponent(trimmedCategory)}`);
    } catch (error) {
      console.error("更新エラー:", error);
      alert("通信エラーが発生しました");
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <p className="text-center text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (!targetCard) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div>
          <p className="text-center text-gray-500">問題が見つかりません</p>
          <Link
            href="/"
            className="block text-center text-pink-500 hover:underline"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-pink-500">
          カード編集
        </h1>

        <div>
          <p className="mb-3 text-xl font-bold">問題</p>
          <input
            className="w-full border border-pink-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div>
          <p className="mb-3 text-xl font-bold">答え</p>
          <textarea
            className="w-full border border-pink-200 rounded-2xl p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>

        <div>
          <p className="mb-3 text-xl font-bold">カテゴリー</p>
          <input
            className="w-full border border-pink-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-2xl transition"
          onClick={handleSave}
        >
          保存
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
