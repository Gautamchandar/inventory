import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HBTX Inventory Dashboard | Real-Time WooCommerce Stock Engine",
  description: "Live real-time inventory management dashboard for HBTX Professional hair care products integrated with WooCommerce REST API and Webhooks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
