import type { Metadata, Viewport } from "next";
import { Anton, Geist, Geist_Mono, Caveat_Brush } from "next/font/google";
import BuildEngine from "@/components/BuildEngine";
import { RobotHead } from "@/components/RobotHead";
import { profile, seo } from "@/lib/data";
import "./globals.css";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const caveat = Caveat_Brush({ subsets: ["latin"], weight: "400", variable: "--font-caveat", display: "swap" });

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "website",
    title: seo.title,
    description: seo.description,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: { card: "summary", title: seo.title, description: seo.description },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint: decides whether the cursors build the page, so nothing flashes.
// ?agents=on forces it (even with reduced motion), ?agents=off disables it, otherwise the saved choice / OS setting decides.
const headScript = `(function(){try{var d=document.documentElement,m=/[?&]agents=(on|off)/.exec(location.search),ls=null;try{ls=localStorage.getItem('agents')}catch(e){}
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var on=m?m[1]==='on':(ls?ls==='on':!rm);
if(on){d.classList.add('build-mode');setTimeout(function(){if(!window.__af){d.classList.remove('build-mode')}},9000)}
d.setAttribute('data-agents',on?'on':'off');
try{if(sessionStorage.getItem('tour')==='1'){history.scrollRestoration='manual'}}catch(e){}
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${geist.variable} ${geistMono.variable} ${caveat.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>
        <div id="boot" className="boot" aria-hidden="true">
          <div className="boot-inner">
            <RobotHead className="boot-bot" color="#ff3b2f" />
            <div>spawning build agents</div>
            <div className="boot-bar"><i /></div>
            <div style={{ color: "#52525b" }}>building portfolio</div>
          </div>
        </div>
        {children}
        <BuildEngine />
      </body>
    </html>
  );
}
