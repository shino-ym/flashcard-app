"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/types/card";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = Number(params.id);

  const [cards, setCards] = useState<Card[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : [];
  });

  const targetCard = cards.find((c) => c.id === cardId);

  const [question, setQuestion] = useState(targetCard?.question || "");
  const [answer, setAnswer] = useState(targetCard?.answer || "");
  const [category, setCategory] = useState(targetCard?.category || "");

  if (!targetCard) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div>
          <p className="text-center text-gray-500">問題が見つかりません</p>
          <Link href="/" className="block text-pink-500 hover:underline">
            HOMEへ戻る
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) return;

    const updatedCard: Card = {
      ...targetCard,
      question,
      answer,
      category,
    };

    const updatedCards = cards.map((c) => (c.id === cardId ? updatedCard : c));

    setCards(updatedCards);
    localStorage.setItem("cards", JSON.stringify(updatedCards));

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-pink-500">
          カード編集
        </h1>

        <p className="mb-3 text-1xl font-bold">問題</p>
        <input
          className="w-full border border-pink-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <p className="mb-3 text-1xl font-bold">答え</p>
        <textarea
          className="w-full border border-pink-200 rounded-2xl p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-pink-300"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <p className="mb-3 text-1xl font-bold">カテゴリー</p>
        <input
          className="w-full border border-pink-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

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
          ホームへ戻る
        </Link>
      </main>
    </div>
  );
}
