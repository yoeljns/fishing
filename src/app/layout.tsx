import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { isAuthenticated } from "@/lib/session";
import { Nav } from "@/components/Nav";
import { ToastProvider } from "@/components/Toast";
import { themeBootScript } from "@/components/ThemeToggle";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ToastProvider>
          {authed ? <Nav /> : null}
          <main
            id="main"
            className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 pb-24 md:pb-6"
          >
            {children}
          </main>
          {authed ? <MobileNavSpacer /> : null}
        </ToastProvider>
      </body>
    </html>
  );
}

function MobileNavSpacer() {
  return <div aria-hidden className="h-0 md:hidden" />;
}
