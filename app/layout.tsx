import type { Metadata } from "next";
import { Space_Grotesk, Manrope, Inter, Architects_Daughter, Permanent_Marker } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { ClientHeader } from "@/components/ui/ClientHeader";
import { Providers } from "./providers";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { SocialLinks } from "@/components/ui/SocialLinks";
import Script from "next/script";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: '--font-space-grotesk'
});

const manrope = Manrope({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: '--font-manrope'
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["900"],
  variable: '--font-inter'
});

const architects = Architects_Daughter({
  subsets: ["latin"],
  weight: ["400"],
  variable: '--font-architects'
});

const marker = Permanent_Marker({
  subsets: ["latin"],
  weight: ["400"],
  variable: '--font-marker'
});


export const metadata: Metadata = {
  title: "DILIO | HOUSE MÚSIC",
  description: "Digital Curation. An exploration of sound and light.",
};

export const viewport: import("next").Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/video300_frames/frame_001.jpg" as="image" {...{ fetchPriority: "high" } as any} />
      </head>
      <body className={`${spaceGrotesk.variable} ${manrope.variable} ${inter.variable} ${architects.variable} ${marker.variable} font-body bg-surface text-primary antialiased overflow-x-hidden w-full relative`}>
        {/* Carga asíncrona de SoundCloud SDK (no penaliza carga y respeta contexto global) */}
        <Script src="https://w.soundcloud.com/player/api.js" strategy="lazyOnload" />
        
        <Providers>
          <ClientHeader />
          <CartDrawer />

          {children}


          {/* Footer */}
          <footer id="section-social" className="bg-surface py-12 border-t border-primary/10">
            <div className="max-w-[800px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-6">

              <div className="flex gap-8">
                <a href="/legal/privacy" className="label-xs text-[#888] hover:text-primary transition-colors">PRIVACY</a>
                <a href="/legal/terms" className="label-xs text-[#888] hover:text-primary transition-colors">TERMS</a>
              </div>
              
              <div className="flex gap-6 items-center">
                <SocialLinks />
              </div>

              <div>
                 <span className="label-xs text-[#888]">© 2026 DILIO. ALL RIGHTS RESERVED.</span>
              </div>
            </div>
          </footer>


          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
