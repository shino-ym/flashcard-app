"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

  useEffect(() => {
    const checkAuth = async () => {
      // loginとregisterページはチェックしない
      if (pathname === "/login" || pathname === "/register") {
        setIsChecking(false);
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/user`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error(error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [pathname, router, API_BASE]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">認証確認中...</p>
      </div>
    );
  }

  return <>{children}</>;
}
