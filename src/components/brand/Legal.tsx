import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Bits";

/** Shared layout for policy pages: sticky contents list + readable prose column. */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  sections: { id: string; title: string; body: ReactNode }[];
}) {
  return (
    <div className="container-velora pt-4 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <header className="mt-10 max-w-3xl">
        <h1 className="font-serif text-6xl leading-[0.95] font-light md:text-8xl">{title}</h1>
        <p className="text-ink-muted mt-4 text-xs tracking-[0.2em] uppercase">Last updated {updated}</p>
        <div className="text-ink-soft mt-6 text-[1rem] leading-relaxed">{intro}</div>
      </header>
      <div className="mt-16 grid gap-12 lg:grid-cols-12">
        <nav aria-label="On this page" className="lg:col-span-3">
          <ol className="space-y-2 text-sm lg:sticky lg:top-28">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-ink-soft hover:text-rose transition">
                  {String(i + 1).padStart(2, "0")} · {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="max-w-2xl space-y-12 lg:col-span-8 lg:col-start-5">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-32">
              <h2 className="font-serif text-3xl">
                <span className="text-rose mr-3">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              <div className="text-ink-soft mt-4 space-y-4 text-[0.95rem] leading-relaxed [&_a]:underline [&_li]:ml-5 [&_li]:list-disc">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
