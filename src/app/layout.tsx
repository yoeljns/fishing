import type { Metadata } from "next";
import "./globals.css";
import { isAuthenticated } from "@/lib/session";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Fishing Journal",
  description: "Personal fishing catch journal",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {authed ? <Nav /> : null}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
