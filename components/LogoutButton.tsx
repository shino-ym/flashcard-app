"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("ログアウト失敗");
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("ログアウト失敗");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl bg-gray-200 px-4 py-2 hover:bg-gray-300"
    >
      ログアウト
    </button>
  );
}
