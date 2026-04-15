import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { fontSirwan } from "../public/fonts";
import "./globals.css";
import Loading from "./loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "miwani-mawlawi",
  description: "miwani-mawlawi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ckb"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} ${fontSirwan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sirwan">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
