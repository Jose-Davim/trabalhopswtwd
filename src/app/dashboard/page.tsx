"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login"); // Redireciona para login se não houver token
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login"); // Redireciona para login após logout
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo à área protegida!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
