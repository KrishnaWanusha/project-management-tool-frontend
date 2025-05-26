import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components_v2/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProjectHub - GitHub Project Management",
  description: "Manage your GitHub projects with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
