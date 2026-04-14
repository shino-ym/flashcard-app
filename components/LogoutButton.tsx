"use client";

import { usePathname, useRouter } from "next/navigation";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(";").shift()!);
  }
  return null;
}

export default function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch(
        `${API_BASE}/sanctum/csrf-cookie`,
        {
          credentials: "include",
        },
      );

      const xsrfToken = getCookie("XSRF-TOKEN");

      if (!xsrfToken) {
        alert("トークン取得失敗");
        return;
      }

      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        headers: {
          "X-XSRF-TOKEN": xsrfToken,
        },
        credentials: "include",
      });

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
