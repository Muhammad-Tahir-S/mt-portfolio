import type { Metadata } from "next";
import { Cormorant_Garamond, Schibsted_Grotesk } from "next/font/google";
import { SiteNav } from "@/components/dom/site-nav";
import { ScrollRoot } from "@/components/motion/scroll-root";
import clsx from "clsx";

const floral = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "300",
  style: "italic",
  display: "swap",
  variable: "--font-floral",
});

const grotesque = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-grotesque",
});
const voice = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "300",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-voice",
});

export const metadata: Metadata = {
  title: "mt.dev",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={clsx(floral.variable, grotesque.variable, voice.variable)}>
      <body>
        <ScrollRoot />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
