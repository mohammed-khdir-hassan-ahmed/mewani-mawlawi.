import type { Metadata } from "next";
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Admin Dashboard - miwani-mawlawi",
  description: "Admin dashboard",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
}
