import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "FrameFlow",
    template: "%s | FrameFlow",
  },
  description:
    "A cinematic movie and TV streaming frontend powered by TMDB discovery data and vidsrc.wtf playback embeds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-background text-foreground antialiased">
        <div className="relative flex min-h-screen flex-col">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-[-8rem] top-[-10rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(255,110,58,0.26),_transparent_70%)] blur-2xl" />
            <div className="absolute right-[-10rem] top-32 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(98,196,255,0.12),_transparent_72%)] blur-3xl" />
            <div className="absolute bottom-[-12rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,_rgba(240,186,67,0.14),_transparent_72%)] blur-3xl" />
          </div>
          <SiteHeader />
          <main className="relative z-10 flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
