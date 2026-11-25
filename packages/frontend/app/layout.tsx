import type { Metadata } from "next";
import "./globals.css";
import { GlobalToaster } from "./components/global-toaster";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CelluLite Bundle | Data bundles in Ghana",
  description: "Browse MTN, Telecel and AirtelTigo data bundles in Ghana, send data to another number, and track your orders.",
  icons: {
    icon: "/cellulite_logo_icon.svg"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Providers>{children}</Providers>
        <GlobalToaster />
      </body>
    </html>
  );
}
