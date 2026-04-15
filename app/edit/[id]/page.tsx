"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/types/card";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = Number(params.id);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

  const [targetCard, setTargetCard] = useState<Card | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("読み込み中...");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("ログインしてください");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/cards`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setMessage(data?.message || "カード取得失敗");
          return;
        }

        const foundCard = data.find((card: Card) => card.id === cardId);

        if (!foundCard) {
          setMessage("問題が見つかりません");
          return;
        }

        setTargetCard(foundCard);
        setQuestion(foundCard.question);
        setAnswer(foundCard.answer);
        setCategory(foundCard.category);
        setMessage("");
      } catch (error) {
        console.error(error);
        setMessage("通信エラーが発生しました");
      }
    };

    fetchCard();
  }, [cardId, API_BASE]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("ログインしてください");
      return;
    }

    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();
    const trimmedCategory = category.trim();

    if (!targetCard) return;
    if (!trimmedQuestion || !trimmedAnswer || !trimmedCategory) return;

    try {
      setIsSaving(true);

      const res = await fetch(`${API_BASE}/api/cards/${cardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: trimmedCategory,
          question: trimmedQuestion,
          answer: trimmedAnswer,
          status: targetCard.status,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "保存失敗");
        return;
      }

      router.push(`/cards/${encodeURIComponent(trimmedCategory)}`);
    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました");
    } finally {
      setIsSaving(false);
    }
  };

  if (message) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto w-full max-w-md px-4 py-6">
          <p className="text-center text-gray-500">{message}</p>
        </main>
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

        <div className="space-y-4 rounded-3xl bg-white p-5 shadow-md">
          <p className="mb-3 text-xl font-bold">問題</p>
          <input
            className="w-full border border-pink-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <p className="mb-3 text-xl font-bold">答え</p>
          <textarea
            className="w-full border border-pink-200 rounded-2xl p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <p className="mb-3 text-xl font-bold">カテゴリー</p>
          <input
            className="w-full border border-pink-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-2xl transition disabled:opacity-50"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "保存中..." : "保存"}
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
