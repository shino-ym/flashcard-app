"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/types/card";

export default function CardsCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const category = decodeURIComponent(String(params.category));

  const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

  const [cards, setCards] = useState<Card[]>([]);
  const [message, setMessage] = useState("読み込み中...");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchCards = async () => {
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

        setCards(data);
        setMessage("");
      } catch (error) {
        console.error(error);
        setMessage("通信エラーが発生しました");
      }
    };

    fetchCards();
  }, [API_BASE]);

  const filteredCards =
    category.toLowerCase() === "all"
      ? cards
      : cards.filter(
          (card) =>
            card.category.trim().toLowerCase() ===
            category.trim().toLowerCase(),
      );
  
  const searchedCards = filteredCards.filter((card) => {
    const keyword = searchText.toLowerCase();

    return (
      card.question.toLowerCase().includes(keyword) ||
      card.answer.toLowerCase().includes(keyword) ||
      card.category.toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(searchedCards.length / ITEMS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCards = searchedCards.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const toggleMastered = async (id: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("ログインしてください");
      return;
    }

    try {
      const targetCard = cards.find((c) => c.id === id);
      if (!targetCard) return;

      const newStatus: Card["status"] =
        targetCard.status === "mastered" ? "new" : "mastered";

      const res = await fetch(`${API_BASE}/api/cards/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: targetCard.category,
          question: targetCard.question,
          answer: targetCard.answer,
          status: newStatus,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "更新失敗");
        return;
      }

      setCards((prev) =>
        prev.map((card) =>
          card.id === id ? { ...card, status: newStatus } : card,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("通信エラー");
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("ログインしてください");
      return;
    }

    const ok = window.confirm("この問題を削除しますか？");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/cards/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "削除失敗");
        return;
      }

      setCards((prev) => prev.filter((card) => card.id !== id));
    } catch (error) {
      console.error(error);
      alert("通信エラー");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md space-y-6 px-4 py-6">
        <h1 className="text-center text-3xl font-bold text-pink-500">
          {category}の問題一覧
        </h1>

        {message && <p className="text-center text-gray-500">{message}</p>}

        <input
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1); // ← これ重要（ページリセット）
          }}
          placeholder="問題・答え・カテゴリーで検索"
          className="w-full rounded-2xl border border-pink-200 px-4 py-3"
        />

        {!message && searchedCards.length === 0 && (
          <p className="text-center text-gray-500">問題がありません</p>
        )}

        {paginatedCards.map((card) => (
          <div
            key={card.id}
            className="space-y-3 rounded-3xl bg-white p-5 shadow-md"
          >
            <div>
              <p className="text-center text-lg font-semibold">
                {card.question}
              </p>
            </div>

            <div className="flex justify-center gap-3 text-center">
              <button
                className="rounded-2xl bg-pink-100 px-4 py-2 hover:bg-pink-200"
                onClick={() => router.push(`/edit/${card.id}`)}
              >
                編集
              </button>

              <button
                className="rounded-2xl bg-green-100 px-4 py-2 hover:bg-green-200"
                onClick={() => toggleMastered(card.id)}
              >
                {card.status === "mastered" ? "未習得に戻す" : "覚えた"}
              </button>

              <button
                className="rounded-2xl bg-red-100 px-4 py-2 hover:bg-red-200"
                onClick={() => handleDelete(card.id)}
              >
                削除
              </button>
            </div>
          </div>
        ))}

        {totalPages > 1 && (
          <div className="flex justify-center gap-3 pt-4">
            <button
              className="rounded-2xl bg-pink-100 px-4 py-2 hover:bg-pink-200 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              前の10件
            </button>

            <p className="self-center text-sm text-gray-500">
              {safeCurrentPage} / {totalPages}
            </p>

            <button
              className="rounded-2xl bg-pink-100 px-4 py-2 hover:bg-pink-200 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={safeCurrentPage === totalPages}
            >
              次の10件
            </button>
          </div>
        )}

        <button
          className="mx-auto block rounded-2xl bg-purple-100 px-4 py-2 hover:bg-purple-200"
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
