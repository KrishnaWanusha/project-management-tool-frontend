"use client";
import MainLayout from "@components/layout/main.layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MainLayout showBackButton={false} backButtonText="Back to Projects">
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
