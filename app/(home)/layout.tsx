import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Loading from "@/app/loading";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </>
  );
}
