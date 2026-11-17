import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <h1 className="font-semibold text-2xl tracking-tight">Dashboard</h1>;
}
