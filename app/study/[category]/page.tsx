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
  const [message, setMessage] = useState("読み込み中...");
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isRandom, setIsRandom] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("http://localhost/api/cards", {
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
        setMessage("通信エラー");
      }
    };

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

  const toggleRandomMode = () => {
    const nextIsRandom = !isRandom;
    setIsRandom(nextIsRandom);

    if (nextIsRandom && filteredCards.length > 0) {
      let randomIndex = Math.floor(Math.random() * filteredCards.length);

      if (filteredCards.length > 1) {
        while (randomIndex === safeIndex) {
          randomIndex = Math.floor(Math.random() * filteredCards.length);
        }
      }

      setIndex(randomIndex);
      setShowAnswer(false);
    }
  };

  const nextCard = () => {
    if (isRandom) {
      if (filteredCards.length <= 1) {
        setShowAnswer(false);
        return;
      }

      let randomIndex = Math.floor(Math.random() * filteredCards.length);

      while (randomIndex === safeIndex) {
        randomIndex = Math.floor(Math.random() * filteredCards.length);
      }

      setIndex(randomIndex);
    } else {
      setIndex((prev) => (prev + 1) % filteredCards.length);
    }

    setShowAnswer(false);
  };

  const prevCard = () => {
    setIndex((prev) => (prev === 0 ? filteredCards.length - 1 : prev - 1));
    setShowAnswer(false);
  };

  const toggleMastered = async (id: number) => {
    try {
      const targetCard = cards.find((c) => c.id === id);
      if (!targetCard) return;

      const newStatus: Card["status"] =
        targetCard.status === "mastered" ? "new" : "mastered";

      await fetch("http://localhost/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const xsrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      if (!xsrfToken) {
        alert("トークン取得失敗");
        return;
      }

      const res = await fetch(`http://localhost/api/cards/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
        },
        credentials: "include",
        body: JSON.stringify({
          category: targetCard.category,
          question: targetCard.question,
          answer: targetCard.answer,
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "更新失敗");
        return;
      }

      const updatedCards = cards.map((c) =>
        c.id === id ? { ...c, status: newStatus } : c,
      );

      setCards(updatedCards);

      const nextFilteredCards =
        category.toLowerCase() === "all"
          ? updatedCards.filter((card) => card.status !== "mastered")
          : updatedCards.filter(
              (card) =>
                card.category.toLowerCase() === category.toLowerCase() &&
                card.status !== "mastered",
            );

      if (
        safeIndex >= nextFilteredCards.length &&
        nextFilteredCards.length > 0
      ) {
        setIndex(0);
      }

      setShowAnswer(false);
    } catch (error) {
      console.error(error);
      alert("通信エラー");
    }
  };

  const deleteCard = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      await fetch("http://localhost/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const xsrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      if (!xsrfToken) {
        alert("トークン取得失敗");
        return;
      }

      const res = await fetch(`http://localhost/api/cards/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "削除失敗");
        return;
      }

      setCards((prev) => prev.filter((c) => c.id !== id));
      setShowAnswer(false);
    } catch (error) {
      console.error(error);
      alert("通信エラー");
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

        <div className="flex gap-3 justify-center flex-wrap">
          {filteredCards.length > 1 && !isRandom && (
            <button
              className="bg-pink-100 hover:bg-pink-200 px-6 py-3 rounded-2xl transition"
              onClick={prevCard}
            >
              前へ
            </button>
          )}

          <button
            className={`px-6 py-3 rounded-2xl transition ${
              isRandom
                ? "bg-purple-300 hover:bg-purple-400 text-white"
                : "bg-purple-100 hover:bg-purple-200 text-gray-700"
            }`}
            onClick={toggleRandomMode}
          >
            {isRandom ? "順番に出題に戻す" : "ランダムで出題"}
          </button>

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
