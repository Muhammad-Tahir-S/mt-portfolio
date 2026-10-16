import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { SiteNav } from "@/components/dom/site-nav";

const floral = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "300",
  style: "italic",
  display: "swap",
  variable: "--font-floral",
});

export const metadata: Metadata = {
  title: "mt.dev",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={floral.variable}>
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
