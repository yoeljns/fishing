import type { Metadata, Viewport } from "next";
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
  title: {
    default: "Fishing Journal",
    template: "%s · Fishing Journal",
  },
  description: "Personal fishing catch journal",
  applicationName: "Fishing Journal",
  appleWebApp: {
    capable: true,
    title: "Fishing",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
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
        </ToastProvider>
      </body>
    </html>
  );
}
