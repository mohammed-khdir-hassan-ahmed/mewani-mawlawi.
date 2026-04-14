import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - miwani-mawlawi",
  description: "Admin login",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
