"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md space-y-6 px-4 py-6">
        <h1 className="text-center text-3xl font-bold text-pink-500">
          Flashcard App
        </h1>

        <p className="text-center text-sm text-gray-500">
          AIで答えを生成して、そのまま学習できる！
        </p>

        <Link
          href="/study"
          className="block rounded-2xl bg-rose-600 px-8 py-3 text-center font-semibold text-white transition hover:bg-rose-500"
        >
          学習を始める
        </Link>

        <Link
          href="/add"
          className="block rounded-2xl bg-pink-500 px-8 py-3 text-center font-semibold text-white transition hover:bg-pink-600"
        >
          問題を追加
        </Link>

        <Link
          href="/cards"
          className="block rounded-2xl bg-purple-400 py-3 text-center font-semibold text-white transition hover:bg-purple-500"
        >
          問題一覧を見る
        </Link>
      </main>
    </div>
  );
}
