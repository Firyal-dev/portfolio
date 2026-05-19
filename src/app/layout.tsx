import type { Metadata } from "next";
import "./globals.css";
import { Roboto, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import Footer from "@/partials/footer";
import Nav from "@/partials/nav";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  verification: {
    google: "gMKOqq5s2pMSRsfnK_WPIIhayEpTbHOXETG9MOum-FY",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Firyal Muhammad Azka | Junior Web Developer",
    template: "%s | Firyal Muhammad Azka",
  },
  description:
    "Portfolio of Firyal Muhammad Azka, a junior fullstack web developer building clean, practical, and maintainable web applications.",
  keywords: [
    "Firyal Muhammad Azka",
    "Firyal Dev",
    "Fullstack Web Developer",
    "Junior Web Developer",
    "Next.js Developer",
    "React Developer",
    "Laravel Developer",
    "Portfolio",
  ],
  authors: [{ name: "Firyal Muhammad Azka" }],
  creator: "Firyal Muhammad Azka",
  publisher: "Firyal Muhammad Azka",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Firyal Muhammad Azka | Fullstack Web Developer",
    description:
      "Junior fullstack web developer focused on responsive interfaces, backend logic, APIs, and maintainable web applications.",
    url: "/",
    siteName: "firyal.dev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Firyal Muhammad Azka | Fullstack Web Developer",
    description:
      "Portfolio of Firyal Muhammad Azka, a junior fullstack web developer.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Nav />
            <main>{children}</main>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
