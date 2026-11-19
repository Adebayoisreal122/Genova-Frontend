import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/Dashboard";

export const metadata: Metadata = { title: "Studio", robots: { index: false } };

export default function Page() {
  return <Dashboard />;
}
