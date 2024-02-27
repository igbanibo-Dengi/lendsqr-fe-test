import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.scss";

// const inter = Inter({ subsets: ["latin"] });

// Font files can be colocated inside of `app`
const myFont = localFont({
  src: './font/AvenirNext.otf',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={myFont.className}>{children}</body>
    </html>
  );
}
