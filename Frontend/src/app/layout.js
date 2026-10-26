import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import SmoothScroll from "./component/common/SmoothScroll";
import MouseFollower from "./component/common/MouseFollower";
import Header from "./component/common/Header";
import Footer from "./component/common/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Omni Mall | Furniture & Home Finds",
  description: "Discover thoughtful furniture, lighting, and accessories for a home with personality.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Corrected Google Font connection tags */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Asimovian&family=Jim+Nightshade&family=Noto+Kufi+Arabic:wght@100..900&display=swap" 
          rel="stylesheet" 
        />
        {/* Font Awesome CDN dependency */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <SmoothScroll />
        <MouseFollower />
        {/* <Header/> */}
        {children}
        <Footer />
      </body>
    </html>
  );
}
