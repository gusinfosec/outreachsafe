import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://outreachsafe.com"),
  title: {
    default: "OutreachSafe — LinkedIn Outreach Compliance Checker",
    template: "%s — OutreachSafe",
  },
  description:
    "Check your LinkedIn outreach messages against TOS, CAN-SPAM, and GDPR before you send. Get a compliance score and specific fix suggestions in under 20 seconds. Free to start.",
  keywords: [
    "LinkedIn compliance checker",
    "LinkedIn outreach TOS",
    "CAN-SPAM checker",
    "GDPR outreach",
    "LinkedIn account ban prevention",
    "SDR compliance tool",
    "LinkedIn message checker",
  ],
  authors: [{ name: "Cyber Global Technologies LLC" }],
  creator: "Cyber Global Technologies LLC",
  openGraph: {
    type: "website",
    url: "https://outreachsafe.com",
    siteName: "OutreachSafe",
    title: "OutreachSafe — LinkedIn Outreach Compliance Checker",
    description:
      "Know if your LinkedIn message is safe to send — before you send it. Free compliance score, flagged patterns, and specific fix suggestions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OutreachSafe — LinkedIn Outreach Compliance Checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OutreachSafe — LinkedIn Outreach Compliance Checker",
    description:
      "Know if your LinkedIn message is safe to send — before you send it.",
    images: ["/og-image.png"],
    creator: "@outreachsafe",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon.svg?v=3", type: "image/svg+xml" },
      { url: "/favicon-32x32.png?v=3", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico?v=3", sizes: "any" },
    ],
    apple: { url: "/apple-touch-icon.png?v=3", sizes: "180x180" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>{children}</body>
    </html>
  );
}
