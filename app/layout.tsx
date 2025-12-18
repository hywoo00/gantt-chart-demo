import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gantt Chart Demo",
  description: "Next.js Gantt Chart Demo with react-google-charts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

