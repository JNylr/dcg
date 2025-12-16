import Script from "next/script";
import type { Metadata } from "next";
import "../src/styles/globals.css";

export const metadata: Metadata = {
  title: "Doncaster Gaming Event",
  description: "Register your interest for the Doncaster Gaming Event.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-RR431M048X"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-RR431M048X');
        `}
      </Script>
      <body className="min-h-screen bg-gray-950">{children}</body>
    </html>
  );
}
