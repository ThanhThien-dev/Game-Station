import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Joy Station - Trung Tâm Gaming Cao Cấp Tại Bình Thạnh",
    template: "%s | Joy Station",
  },
  description:
    "Trải nghiệm chơi game đỉnh cao tại Joy Station - Nintendo Switch, PS4, Xbox 360. Đặt combo online, giá từ 50k. Địa chỉ: 64/10 Võ Oanh, P.25, Bình Thạnh, TP.HCM",
  keywords: [
    "Joy Station",
    "gaming center",
    "tiệm net bình thạnh",
    "nintendo switch",
    "ps4",
    "xbox 360",
    "đặt lịch chơi game",
    "combo gaming",
  ],
  authors: [{ name: "Joy Station" }],
  creator: "Joy Station",
  publisher: "Joy Station",
  metadataBase: new URL("https://joystation.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://joystation.vercel.app",
    title: "Joy Station - Trung Tâm Gaming Cao Cấp Tại Bình Thạnh",
    description:
      "Trải nghiệm chơi game đỉnh cao với thiết bị hiện đại. Đặt combo online, giá từ 50k.",
    siteName: "Joy Station",
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joy Station - Gaming Center",
    description: "Trải nghiệm chơi game đỉnh cao tại Bình Thạnh",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EntertainmentBusiness",
    name: "Joy Station",
    description: "Trung tâm gaming ca cấp tại Bình Thạnh, TP.HCM",
    url: "https://joystation.vercel.app",
    telephone: "+84-912-345-678",
    address: {
      "@type": "PostalAddress",
      streetAddress: "64/10 Võ Oanh",
      addressLocality: "Phường 25, Bình Thạnh",
      addressRegion: "TP.HCM",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 10.8006,
      longitude: 106.7053,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "23:00",
    },
    priceRange: "50000-250000 VND",
    image: "https://joystation.vercel.app/og-image.jpg",
    sameAs: [
      "https://facebook.com/joystation",
      "https://instagram.com/joystation",
    ],
  };

  return (
    <html lang="vi" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}