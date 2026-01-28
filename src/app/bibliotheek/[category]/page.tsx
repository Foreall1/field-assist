import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Eye, Filter, ChevronDown, ArrowRight } from "lucide-react";

// Mock articles data
const articles = [
  {
    id: "1",
    slug: "omgevingswet-belangrijkste-wijzigingen",
    title: "Nieuwe Omgevingswet: de belangrijkste wijzigingen op een rij",
    summary: "Een compleet overzicht van wat er verandert met de inwerkingtreding van de Omgevingswet en wat dit betekent voor uw dagelijkse praktijk als vergunningverlener.",
    author: "Mr. J. van der Berg",
    date: "2024-01-15",
    readTime: 12,
    views: 2847,
    tags: ["omgevingswet", "vergunningen", "procedures"],
  },
  {
    id: "2",
    slug: "aanvraag-omgevingsvergunning-stappenplan",
    title: "Aanvraag omgevingsvergunning: een compleet stappenplan",
    summary: "Van binnenkomst tot besluit: alle stappen die u moet doorlopen bij de behandeling van een aanvraag om omgevingsvergunning.",
    author: "Drs. M. Bakker",
    date: "2024-01-12",
    readTime: 15,
    views: 1654,
    tags: ["aanvraag", "procedure", "stappenplan"],
  },
  {
    id: "3",
    slug: "weigeringsgronden-omgevingsvergunning",
    title: "Weigeringsgronden voor de omgevingsvergunning",
    summary: "Wanneer moet u een omgevingsvergunning weigeren? Een overzicht van de wettelijke weigeringsgronden en hoe deze toe te passen.",
    author: "Mr. K. de Vries",
    date: "2024-01-10",
    readTime: 10,
    views: 1432,
    tags: ["weigering", "gronden", "beoordeling"],
  },
  {
    id: "4",
    slug: "vergunningvrij-bouwen-omgevingswet",
    title: "Vergunningvrij bouwen onder de Omgevingswet",
    summary: "Wat mag er zonder vergunning worden gebouwd? Een praktische handleiding voor het bepalen van vergunningvrije activiteiten.",
    author: "Ir. P. Jansen",
    date: "2024-01-08",
    readTime: 8,
    views: 2103,
    tags: ["vergunningvrij", "bouwregels", "Bbl"],
  },
  {
    id: "5",
    slug: "termijnen-vergunningprocedure",
    title: "Termijnen in de vergunningprocedure: van aanvraag tot besluit",
    summary: "Alle fatale en niet-fatale termijnen op een rij, inclusief tips voor een goede termijnbewaking.",
    author: "Mr. J. van der Berg",
    date: "2024-01-05",
    readTime: 9,
    views: 1876,
    tags: ["termijnen", "procedure", "deadlines"],
  },
];

const categoryInfo: Record<string, { name: string; description: string }> = {
  vergunningen: {
    name: "Vergunningverlening",
    description: "Alles over omgevingsvergunningen, procedures en aanvragen onder de Omgevingswet.",
  },
  handhaving: {
    name: "Toezicht & Handhaving",
    description: "Handhavingsbeleid, sancties, toezichtprocedures en interventiestrategieën.",
  },
  juridisch: {
    name: "Juridisch",
    description: "Wet- en regelgeving, jurisprudentie, bezwaarprocedures en Awb-zaken.",
  },
  "ruimtelijke-ordening": {
    name: "Ruimtelijke Ordening",
    description: "Bestemmingsplannen, omgevingsplan, omgevingsvisie en gebiedsontwikkeling.",
  },
  milieu: {
    name: "Milieu & Duurzaamheid",
    description: "Milieurecht, duurzaamheidsbeleid, energietransitie en circulaire economie.",
  },
  bouwen: {
    name: "Bouwen & Wonen",
    description: "Bouwregelgeving, Bbl, woningbouw, constructieve veiligheid en kwaliteitsborging.",
  },
};

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const info = categoryInfo[params.category] || {
    name: "Categorie",
    description: "Artikelen in deze categorie",
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Link
        href="/bibliotheek"
        className="inline-flex items-center gap-2 text-sm text-[#8b97a5] hover:text-[#288978] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar bibliotheek
      </Link>

      {/* Header */}
      <div className="pb-6 border-b border-[#E2E7ED]">
        <h1 className="text-[#2c3e50] mb-2">{info.name}</h1>
        <p className="text-[#415161] max-w-2xl">{info.description}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2E7ED] rounded-xl hover:border-[#288978]/30 transition-colors">
          <Filter className="w-4 h-4 text-[#8b97a5]" />
          <span className="text-sm text-[#2c3e50]">Filters</span>
        </button>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2E7ED] rounded-xl hover:border-[#288978]/30 transition-colors">
          <span className="text-sm text-[#2c3e50]">Sorteer op: Nieuwste</span>
          <ChevronDown className="w-4 h-4 text-[#8b97a5]" />
        </button>

        <div className="flex-1" />

        <span className="text-sm text-[#8b97a5] bg-[#f8f9fb] px-3 py-1.5 rounded-lg">{articles.length} artikelen</span>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/bibliotheek/${params.category}/${article.slug}`}
            className="block group bg-white rounded-2xl border border-[#E2E7ED] p-6 hover:border-[#288978]/30 hover:shadow-[0_8px_30px_rgba(40,137,120,0.12)] transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-[#288978] bg-[#288978]/10 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold text-[#2c3e50] mb-2 group-hover:text-[#288978] transition-colors">
                  {article.title}
                </h2>

                {/* Summary */}
                <p className="text-[#415161] text-sm mb-4 line-clamp-2">
                  {article.summary}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#8b97a5]">
                  <span className="font-medium text-[#415161]">{article.author}</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(article.date).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime} min lezen
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    {article.views.toLocaleString("nl-NL")} views
                  </span>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-[#c5cdd6] group-hover:text-[#288978] flex-shrink-0 self-center transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
