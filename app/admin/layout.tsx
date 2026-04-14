import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - miwani-mawlawi",
  description: "Admin dashboard",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
