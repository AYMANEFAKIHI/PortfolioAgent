import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Stack from "@/components/Stack";
import Record from "@/components/Record";
import About from "@/components/About";
import Contact from "@/components/Contact";
import { getContent, getLang } from "@/lib/content";

export default async function Page() {
  const c = getContent(await getLang());
  return (
    <main id="main">
      <Hero c={c} />
      <Work c={c} />
      <Stack c={c} />
      <Record c={c} />
      <About c={c} />
      <Contact c={c} />
    </main>
  );
}
