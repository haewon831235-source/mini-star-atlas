import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MINI STAR ATLAS",
  description: "생일로 별자리와 수호 캐릭터를 부여받는 글로벌 IP 팬덤 플랫폼",
};

export const viewport: Viewport = {
  themeColor: "#050816",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const SUPPORTED_LOCALES = ["ko", "en", "ja", "zh"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function isLocale(v: string | undefined): v is Locale {
  return SUPPORTED_LOCALES.includes(v as Locale);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  const locale: Locale = isLocale(raw) ? raw : "ko";
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <div className="app-shell">{children}</div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
