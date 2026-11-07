import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Stack from "@/components/Stack";
import Record from "@/components/Record";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Currently from "@/components/Currently";
import Testimonials from "@/components/Testimonials";
import { getContent, getLang } from "@/lib/content";

export default async function Page() {
  const c = getContent(await getLang());
  return (
    <main id="main">
      <Hero c={c} />
      <Currently c={c} />
      <Work c={c} />
      <Stack c={c} />
      <Record c={c} />
      <Testimonials c={c} />
      <About c={c} />
      <Contact c={c} />
    </main>
  );
}
