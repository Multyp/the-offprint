import "./globals.css";
import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Creepster,
  Permanent_Marker,
} from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
const creepster = Creepster({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-creepster",
});
const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker",
});

export const metadata: Metadata = {
  title: "Concert Memory Maker | DIY Concert Cards",
  description:
    "Create punk-style printable memory cards for your favorite concerts. Raw, DIY aesthetic meets modern functionality.",
  keywords: "concert, memory, punk, DIY, printable, music, gig, flyer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${creepster.variable} ${permanentMarker.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
