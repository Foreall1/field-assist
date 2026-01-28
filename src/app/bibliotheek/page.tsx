import Link from "next/link";
import { Search, FileCheck, Shield, Scale, Map, Leaf, Building, ArrowRight, BookOpen } from "lucide-react";

const categories = [
  {
    id: "vergunningen",
    name: "Vergunningverlening",
    slug: "vergunningen",
    description: "Alles over omgevingsvergunningen, procedures en aanvragen onder de Omgevingswet.",
    icon: FileCheck,
    articleCount: 24,
    color: "bg-blue-50 text-blue-600",
    iconBg: "bg-blue-500",
    popular: ["Omgevingswet basics", "Aanvraagprocedure", "Weigeringsgronden"],
  },
  {
    id: "handhaving",
    name: "Toezicht & Handhaving",
    slug: "handhaving",
    description: "Handhavingsbeleid, sancties, toezichtprocedures en interventiestrategieën.",
    icon: Shield,
    articleCount: 18,
    color: "bg-red-50 text-red-600",
    iconBg: "bg-red-500",
    popular: ["Beginselplicht", "Last onder dwangsom", "Bestuursdwang"],
  },
  {
    id: "juridisch",
    name: "Juridisch",
    slug: "juridisch",
    description: "Wet- en regelgeving, jurisprudentie, bezwaarprocedures en Awb-zaken.",
    icon: Scale,
    articleCount: 31,
    color: "bg-purple-50 text-purple-600",
    iconBg: "bg-purple-500",
    popular: ["Bezwaarprocedure", "Vertrouwensbeginsel", "Awb actueel"],
  },
  {
    id: "ruimtelijke-ordening",
    name: "Ruimtelijke Ordening",
    slug: "ruimtelijke-ordening",
    description: "Bestemmingsplannen, omgevingsplan, omgevingsvisie en gebiedsontwikkeling.",
    icon: Map,
    articleCount: 22,
    color: "bg-[#288978]/10 text-[#288978]",
    iconBg: "bg-[#288978]",
    popular: ["Omgevingsplan", "Participatie", "Planschade"],
  },
  {
    id: "milieu",
    name: "Milieu & Duurzaamheid",
    slug: "milieu",
    description: "Milieurecht, duurzaamheidsbeleid, energietransitie en circulaire economie.",
    icon: Leaf,
    articleCount: 15,
    color: "bg-emerald-50 text-emerald-600",
    iconBg: "bg-emerald-500",
    popular: ["Energielabel C", "Stikstof", "PFAS"],
  },
  {
    id: "bouwen",
    name: "Bouwen & Wonen",
    slug: "bouwen",
    description: "Bouwregelgeving, Bbl, woningbouw, constructieve veiligheid en kwaliteitsborging.",
    icon: Building,
    articleCount: 27,
    color: "bg-amber-50 text-amber-600",
    iconBg: "bg-amber-500",
    popular: ["Wet Kwaliteitsborging", "Bouwveiligheid", "Welstand"],
  },
];

export default function BibliotheekPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-[#f8f9fb] to-[#edeff2] -mx-8 -mt-8 px-8 pt-10 pb-12 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#288978]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-72 h-72 bg-[#33a370]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-[#2c3e50] mb-1">Bibliotheek</h1>
              <p className="text-[#415161] text-lg">
                Verken onze kennisbank met {categories.reduce((sum, c) => sum + c.articleCount, 0)} artikelen
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#288978] to-[#33a370] rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300 -z-10" style={{ margin: '-2px' }} />
            <div className="relative flex items-center bg-white rounded-2xl border-2 border-[#E2E7ED] group-focus-within:border-[#288978] shadow-lg shadow-[#288978]/5 transition-all duration-300">
              <Search className="absolute left-5 w-5 h-5 text-[#8b97a5] group-focus-within:text-[#288978] transition-colors" />
              <input
                type="text"
                placeholder="Zoek in de bibliotheek..."
                className="w-full py-4 pl-14 pr-6 rounded-2xl border-0 text-[#2c3e50] placeholder:text-[#8b97a5] focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2c3e50]">Categorieën</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#288978] to-[#33a370] rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={`/bibliotheek/${category.slug}`}
                className="group bg-white rounded-2xl border border-[#E2E7ED] p-6 hover:border-[#288978]/30 hover:shadow-[0_8px_30px_rgba(40,137,120,0.12)] transition-all duration-300"
              >
                {/* Icon & Count */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-14 h-14 rounded-xl ${category.color} flex items-center justify-center`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-[#415161] bg-[#f8f9fb] rounded-lg">
                    {category.articleCount} artikelen
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-semibold text-[#2c3e50] mb-2 group-hover:text-[#288978] transition-colors">
                  {category.name}
                </h3>
                <p className="text-[#415161] text-sm mb-5 line-clamp-2">
                  {category.description}
                </p>

                {/* Popular Topics */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {category.popular.map((topic) => (
                    <span
                      key={topic}
                      className="text-xs px-2.5 py-1 bg-[#f8f9fb] text-[#415161] rounded-md border border-[#edeff2]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <div className="flex items-center text-[#288978] text-sm font-medium">
                  Bekijk categorie
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
