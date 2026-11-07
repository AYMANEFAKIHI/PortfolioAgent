import type { Metadata, Viewport } from "next";
import { Anton, Geist, Geist_Mono, Caveat_Brush } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import BuildEngine from "@/components/BuildEngine";
import { RobotHead } from "@/components/RobotHead";
import { getContent, getLang } from "@/lib/content";
import { profile, seo } from "@/lib/data";
import { siteUrl } from "@/lib/site";
import CommandPalette from "@/components/CommandPalette";
import { getPaletteItems } from "@/lib/palette";
import "./globals.css";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const caveat = Caveat_Brush({ subsets: ["latin"], weight: "400", variable: "--font-caveat", display: "swap" });


export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const description = getContent(lang).description;
  return {
    metadataBase: new URL(siteUrl),
    title: seo.title,
    description,
    keywords: seo.keywords,
    authors: [{ name: profile.name }],
    creator: profile.name,
    openGraph: {
      type: "website",
      title: seo.title,
      description,
      siteName: profile.name,
      locale: lang === "fr" ? "fr_FR" : "en_US",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${profile.name} — ${profile.role}` }],
    },
    twitter: { card: "summary_large_image", title: seo.title, description, images: ["/og.jpg"] },
  };
}

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  const c = getContent(lang);
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${anton.variable} ${geist.variable} ${geistMono.variable} ${caveat.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">{c.ui.skip}</a>
        <div id="boot" className="boot" aria-hidden="true">
          <div className="boot-inner">
            <RobotHead className="boot-bot" color="#ff3b2f" />
            <div>{lang === "fr" ? "démarrage des agents" : "spawning build agents"}</div>
            <div className="boot-bar"><i /></div>
            <div style={{ color: "#52525b" }}>{lang === "fr" ? "construction du portfolio" : "building portfolio"}</div>
          </div>
        </div>
        {children}
        <BuildEngine />
        <CommandPalette
          lang={lang}
          items={getPaletteItems(lang)}
          labels={{ placeholder: c.ui.palettePlaceholder, none: c.ui.paletteNone, sections: c.ui.paletteSections, projects: c.ui.paletteProjects, certs: c.ui.paletteCerts, actions: c.ui.paletteActions, hint: c.ui.paletteHint }}
        />
        <Analytics />
      </body>
    </html>
  );
}
