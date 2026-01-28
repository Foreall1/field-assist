"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Bookmark,
  Share2,
  ThumbsUp,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { Avatar } from "@/components/ui";

// Mock article content
const article = {
  id: "1",
  title: "Nieuwe Omgevingswet: de belangrijkste wijzigingen op een rij",
  summary:
    "Een compleet overzicht van wat er verandert met de inwerkingtreding van de Omgevingswet en wat dit betekent voor uw dagelijkse praktijk als vergunningverlener.",
  author: {
    name: "Mr. J. van der Berg",
    title: "Senior juridisch adviseur",
    organization: "Ministerie van BZK",
  },
  date: "2024-01-15",
  updatedAt: "2024-01-20",
  readTime: 12,
  category: "Vergunningverlening",
  categorySlug: "vergunningen",
  tags: ["omgevingswet", "vergunningen", "procedures", "transitie"],
  tableOfContents: [
    { id: "inleiding", title: "Inleiding", level: 1 },
    { id: "kernpunten", title: "De kernpunten van de Omgevingswet", level: 1 },
    { id: "vergunningplicht", title: "Gewijzigde vergunningplicht", level: 2 },
    { id: "procedures", title: "Nieuwe procedures", level: 2 },
    { id: "termijnen", title: "Aangepaste termijnen", level: 2 },
    { id: "praktijk", title: "Gevolgen voor de praktijk", level: 1 },
    { id: "tips", title: "Praktische tips", level: 1 },
    { id: "bronnen", title: "Bronnen en verder lezen", level: 1 },
  ],
  relatedArticles: [
    {
      id: "2",
      slug: "aanvraag-omgevingsvergunning-stappenplan",
      title: "Aanvraag omgevingsvergunning: een compleet stappenplan",
      readTime: 15,
    },
    {
      id: "3",
      slug: "vergunningvrij-bouwen-omgevingswet",
      title: "Vergunningvrij bouwen onder de Omgevingswet",
      readTime: 8,
    },
    {
      id: "4",
      slug: "termijnen-vergunningprocedure",
      title: "Termijnen in de vergunningprocedure",
      readTime: 9,
    },
  ],
};

export default function ArticlePage() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeSection, setActiveSection] = useState("inleiding");

  return (
    <div className="flex gap-8">
      {/* Main Content */}
      <div className="flex-1 max-w-3xl">
        {/* Breadcrumb */}
        <Link
          href={`/bibliotheek/${article.categorySlug}`}
          className="inline-flex items-center gap-2 text-sm text-[#8b97a5] hover:text-[#288978] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar {article.category}
        </Link>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            {/* Category & Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-[#288978] rounded-lg">
                {article.category}
              </span>
              {article.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-[#415161] bg-[#f8f9fb] rounded-lg border border-[#edeff2]">
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-[#2c3e50] mb-4">
              {article.title}
            </h1>

            {/* Summary */}
            <p className="text-lg text-[#415161] mb-6 leading-relaxed">{article.summary}</p>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-[#E2E7ED]">
              <div className="flex items-center gap-3">
                <Avatar name={article.author.name} size="md" />
                <div>
                  <p className="font-medium text-[#2c3e50]">
                    {article.author.name}
                  </p>
                  <p className="text-sm text-[#8b97a5]">{article.author.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-[#8b97a5]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.date).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {article.readTime} min lezen
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    isBookmarked
                      ? "bg-[#288978] text-white shadow-md"
                      : "bg-[#f8f9fb] text-[#415161] hover:bg-[#edeff2]"
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className="p-2.5 rounded-xl bg-[#f8f9fb] text-[#415161] hover:bg-[#edeff2] transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <section id="inleiding">
              <h2 className="text-2xl font-semibold text-[#2c3e50] mt-8 mb-4">
                Inleiding
              </h2>
              <p className="text-[#415161] leading-relaxed mb-4">
                De Omgevingswet is op 1 januari 2024 in werking getreden en bundelt
                26 wetten op het gebied van de fysieke leefomgeving. Deze wet
                vormt de basis voor een nieuw stelsel van regels voor bouwen,
                milieu, water, ruimtelijke ordening en natuur.
              </p>
              <p className="text-[#415161] leading-relaxed mb-4">
                Voor vergunningverleners betekent dit een fundamentele wijziging
                in de manier van werken. In dit artikel zetten we de belangrijkste
                veranderingen op een rij en geven we praktische handvatten voor
                de dagelijkse praktijk.
              </p>
            </section>

            <section id="kernpunten">
              <h2 className="text-2xl font-semibold text-[#2c3e50] mt-8 mb-4">
                De kernpunten van de Omgevingswet
              </h2>
              <p className="text-[#415161] leading-relaxed mb-4">
                De Omgevingswet is gebaseerd op vier verbeterdoelen:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-[#415161]">
                <li>
                  <strong className="text-[#2c3e50]">Inzichtelijkheid:</strong> Eén wet in plaats van 26 wetten
                </li>
                <li>
                  <strong className="text-[#2c3e50]">Voorspelbaarheid:</strong> Duidelijke regels en procedures
                </li>
                <li>
                  <strong className="text-[#2c3e50]">Gebruiksgemak:</strong> Eén digitaal loket (DSO)
                </li>
                <li>
                  <strong className="text-[#2c3e50]">Afwegingsruimte:</strong> Meer ruimte voor lokaal maatwerk
                </li>
              </ul>
            </section>

            <section id="vergunningplicht">
              <h3 className="text-xl font-semibold text-[#2c3e50] mt-6 mb-3">
                Gewijzigde vergunningplicht
              </h3>
              <p className="text-[#415161] leading-relaxed mb-4">
                De omgevingsvergunning vervangt de oude Wabo-vergunning. Belangrijke
                wijzigingen zijn:
              </p>
              <div className="bg-gradient-to-r from-[#288978]/10 to-[#33a370]/10 rounded-2xl p-6 mb-4 border border-[#288978]/20">
                <h4 className="font-semibold text-[#288978] mb-2">Let op!</h4>
                <p className="text-[#415161]">
                  De knip tussen bouwen en ruimtelijke aspecten is nieuw. Dit betekent
                  dat een aanvraag nu kan bestaan uit meerdere activiteiten die
                  afzonderlijk worden beoordeeld.
                </p>
              </div>
            </section>

            <section id="procedures">
              <h3 className="text-xl font-semibold text-[#2c3e50] mt-6 mb-3">
                Nieuwe procedures
              </h3>
              <p className="text-[#415161] leading-relaxed mb-4">
                De Omgevingswet kent twee procedures: de reguliere procedure (standaard
                8 weken) en de uitgebreide procedure (standaard 26 weken). De
                reguliere procedure is nu de hoofdregel.
              </p>
            </section>

            <section id="termijnen">
              <h3 className="text-xl font-semibold text-[#2c3e50] mt-6 mb-3">
                Aangepaste termijnen
              </h3>
              <p className="text-[#415161] leading-relaxed mb-4">
                De beslistermijnen zijn aangepast. Gebruik onze termijnencalculator
                om de juiste termijnen te berekenen voor uw specifieke situatie.
              </p>
              <Link
                href="/tools/termijn-calculator"
                className="inline-flex items-center gap-2 text-[#288978] hover:text-[#1e6b5c] font-medium"
              >
                Naar termijnencalculator
                <ExternalLink className="w-4 h-4" />
              </Link>
            </section>

            <section id="praktijk">
              <h2 className="text-2xl font-semibold text-[#2c3e50] mt-8 mb-4">
                Gevolgen voor de praktijk
              </h2>
              <p className="text-[#415161] leading-relaxed mb-4">
                De invoering van de Omgevingswet heeft directe gevolgen voor uw
                dagelijkse werk. Hieronder de belangrijkste aandachtspunten.
              </p>
            </section>

            <section id="tips">
              <h2 className="text-2xl font-semibold text-[#2c3e50] mt-8 mb-4">
                Praktische tips
              </h2>
              <ol className="list-decimal pl-6 mb-4 space-y-2 text-[#415161]">
                <li>Maak uzelf vertrouwd met het Digitaal Stelsel Omgevingswet (DSO)</li>
                <li>Ken de nieuwe activiteiten en hun beoordelingskaders</li>
                <li>Let op de gewijzigde termijnen en plan uw werk daarop</li>
                <li>Stem af met collega&apos;s over de nieuwe werkprocessen</li>
                <li>Volg de actualiteiten via onze nieuwsbrief</li>
              </ol>
            </section>

            <section id="bronnen">
              <h2 className="text-2xl font-semibold text-[#2c3e50] mt-8 mb-4">
                Bronnen en verder lezen
              </h2>
              <ul className="space-y-2 text-[#415161]">
                <li>
                  <a href="#" className="text-[#288978] hover:text-[#1e6b5c] hover:underline">
                    Omgevingswet (officiële wettekst)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#288978] hover:text-[#1e6b5c] hover:underline">
                    Besluit activiteiten leefomgeving (Bal)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#288978] hover:text-[#1e6b5c] hover:underline">
                    Besluit bouwwerken leefomgeving (Bbl)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#288978] hover:text-[#1e6b5c] hover:underline">
                    Informatiepunt Leefomgeving (IPLO)
                  </a>
                </li>
              </ul>
            </section>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-6 border-t border-[#E2E7ED]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#f8f9fb] rounded-xl hover:bg-[#edeff2] transition-colors">
                  <ThumbsUp className="w-4 h-4 text-[#288978]" />
                  <span className="text-sm text-[#2c3e50]">Nuttig (24)</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#f8f9fb] rounded-xl hover:bg-[#edeff2] transition-colors">
                  <MessageSquare className="w-4 h-4 text-[#415161]" />
                  <span className="text-sm text-[#2c3e50]">Reageer</span>
                </button>
              </div>
              <p className="text-sm text-[#8b97a5]">
                Laatst bijgewerkt:{" "}
                {new Date(article.updatedAt).toLocaleDateString("nl-NL")}
              </p>
            </div>
          </footer>
        </article>

        {/* Related Articles */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#2c3e50]">
              Gerelateerde artikelen
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#288978] to-[#33a370] rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {article.relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/bibliotheek/${article.categorySlug}/${related.slug}`}
                className="group bg-white rounded-2xl border border-[#E2E7ED] p-5 hover:border-[#288978]/30 hover:shadow-[0_8px_30px_rgba(40,137,120,0.12)] transition-all duration-300"
              >
                <h3 className="font-medium text-[#2c3e50] mb-3 group-hover:text-[#288978] transition-colors line-clamp-2">
                  {related.title}
                </h3>
                <span className="text-sm text-[#8b97a5] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {related.readTime} min leestijd
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar - Table of Contents */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <h3 className="text-sm font-semibold text-[#2c3e50] mb-4">
            Inhoudsopgave
          </h3>
          <nav className="space-y-1">
            {article.tableOfContents.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={`block py-2 text-sm transition-colors rounded-lg ${
                  item.level === 2 ? "pl-4" : ""
                } ${
                  activeSection === item.id
                    ? "text-[#288978] font-medium bg-[#288978]/10"
                    : "text-[#415161] hover:text-[#2c3e50] hover:bg-[#f8f9fb]"
                } px-3`}
              >
                {item.title}
              </a>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="mt-8 pt-8 border-t border-[#E2E7ED]">
            <h3 className="text-sm font-semibold text-[#2c3e50] mb-4">
              Acties
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isBookmarked
                    ? "bg-[#288978] text-white shadow-md"
                    : "bg-[#f8f9fb] text-[#415161] hover:bg-[#edeff2]"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {isBookmarked ? "Opgeslagen" : "Opslaan"}
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#f8f9fb] text-[#415161] hover:bg-[#edeff2] transition-colors">
                <Share2 className="w-4 h-4" />
                Delen
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
