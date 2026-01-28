import Link from "next/link";
import {
  Calculator,
  Calendar,
  ClipboardCheck,
  GitBranch,
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

const tools = [
  {
    id: "termijn-calculator",
    name: "Termijncalculator",
    description:
      "Bereken fatale termijnen voor vergunningprocedures onder de Omgevingswet. Automatische berekening van beslistermijnen, verdagingstermijnen en bezwaartermijnen.",
    icon: Calendar,
    color: "bg-blue-50 text-blue-600",
    iconBg: "from-blue-500 to-blue-600",
    category: "Calculator",
    popular: true,
    usageCount: 1247,
  },
  {
    id: "leges-calculator",
    name: "Leges calculator",
    description:
      "Bereken de verschuldigde leges voor omgevingsvergunningen op basis van de gemeentelijke legesverordening en bouwkosten.",
    icon: Calculator,
    color: "bg-[#288978]/10 text-[#288978]",
    iconBg: "from-[#288978] to-[#33a370]",
    category: "Calculator",
    popular: true,
    usageCount: 892,
  },
  {
    id: "checklist-omgevingsvergunning",
    name: "Checklist Omgevingsvergunning",
    description:
      "Stap-voor-stap checklist voor de beoordeling van aanvragen om omgevingsvergunning. Van ontvangst tot besluit.",
    icon: ClipboardCheck,
    color: "bg-purple-50 text-purple-600",
    iconBg: "from-purple-500 to-purple-600",
    category: "Checklist",
    popular: true,
    usageCount: 2103,
  },
  {
    id: "beslisboom-vergunningplicht",
    name: "Beslisboom Vergunningplicht",
    description:
      "Bepaal aan de hand van vragen of een activiteit vergunningplichtig is, meldingsplichtig, of vergunningvrij.",
    icon: GitBranch,
    color: "bg-amber-50 text-amber-600",
    iconBg: "from-amber-500 to-amber-600",
    category: "Beslisboom",
    popular: false,
    usageCount: 756,
  },
  {
    id: "checklist-handhaving",
    name: "Checklist Handhavingsverzoek",
    description:
      "Checklist voor de behandeling van handhavingsverzoeken, inclusief beoordeling en termijnbewaking.",
    icon: ClipboardCheck,
    color: "bg-red-50 text-red-600",
    iconBg: "from-red-500 to-red-600",
    category: "Checklist",
    popular: false,
    usageCount: 534,
  },
  {
    id: "beslisboom-handhaving",
    name: "Beslisboom Handhavingsinstrument",
    description:
      "Kies het juiste handhavingsinstrument op basis van de aard van de overtreding en de omstandigheden.",
    icon: GitBranch,
    color: "bg-orange-50 text-orange-600",
    iconBg: "from-orange-500 to-orange-600",
    category: "Beslisboom",
    popular: false,
    usageCount: 423,
  },
  {
    id: "dwangsom-calculator",
    name: "Dwangsomcalculator",
    description:
      "Hulpmiddel voor het bepalen van een passende dwangsomhoogte en begunstigingstermijn bij een last onder dwangsom.",
    icon: Calculator,
    color: "bg-teal-50 text-teal-600",
    iconBg: "from-teal-500 to-teal-600",
    category: "Calculator",
    popular: false,
    usageCount: 312,
  },
  {
    id: "participatie-planner",
    name: "Participatie-planner",
    description:
      "Plan en organiseer participatietrajecten. Bepaal de juiste vorm van participatie en houd de voortgang bij.",
    icon: Users,
    color: "bg-pink-50 text-pink-600",
    iconBg: "from-pink-500 to-pink-600",
    category: "Planner",
    popular: false,
    usageCount: 198,
    isNew: true,
  },
];

const categories = [
  { name: "Alles", count: tools.length },
  { name: "Calculator", count: tools.filter((t) => t.category === "Calculator").length },
  { name: "Checklist", count: tools.filter((t) => t.category === "Checklist").length },
  { name: "Beslisboom", count: tools.filter((t) => t.category === "Beslisboom").length },
];

export default function ToolsPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-[#f8f9fb] to-[#edeff2] -mx-8 -mt-8 px-8 pt-10 pb-12 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#288978]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-72 h-72 bg-[#33a370]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center shadow-lg">
              <Wrench className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-[#2c3e50] mb-1">Tools</h1>
              <p className="text-[#415161] text-lg">
                Praktische hulpmiddelen voor uw dagelijkse werk
              </p>
            </div>
          </div>
          <p className="text-[#415161] max-w-2xl">
            Van termijncalculators tot interactieve checklists en beslisbomen.
            Speciaal ontwikkeld voor professionals in het fysieke domein.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <button
            key={category.name}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              index === 0
                ? "bg-[#288978] text-white shadow-md"
                : "bg-white text-[#415161] border border-[#E2E7ED] hover:border-[#288978]/30 hover:text-[#288978]"
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Featured Tools */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2c3e50]">Populaire tools</h2>
              <p className="text-sm text-[#8b97a5]">Meest gebruikt door collega&apos;s</p>
            </div>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-[#288978] to-[#33a370] rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools
            .filter((tool) => tool.popular)
            .map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="group bg-white rounded-2xl border border-[#E2E7ED] p-6 hover:border-[#288978]/30 hover:shadow-[0_8px_30px_rgba(40,137,120,0.12)] transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.iconBg} flex items-center justify-center shadow-md`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-[#288978] bg-[#288978]/10 rounded-lg">
                      {tool.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#2c3e50] mb-2 group-hover:text-[#288978] transition-colors">
                    {tool.name}
                  </h3>

                  <p className="text-sm text-[#415161] mb-5 line-clamp-2">
                    {tool.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8b97a5] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {tool.usageCount.toLocaleString("nl-NL")}x gebruikt
                    </span>
                    <span className="text-[#288978] text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Open tool
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>

      {/* All Tools */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2c3e50]">Alle tools</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#288978] to-[#33a370] rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools
            .filter((tool) => !tool.popular)
            .map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="group flex items-start gap-5 bg-white rounded-2xl border border-[#E2E7ED] p-5 hover:border-[#288978]/30 hover:shadow-[0_8px_30px_rgba(40,137,120,0.08)] transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#2c3e50] group-hover:text-[#288978] transition-colors">
                        {tool.name}
                      </h3>
                      {tool.isNew && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold text-[#33a370] bg-[#33a370]/10 rounded-md">
                          Nieuw
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#415161] line-clamp-2 mb-2">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-[#415161] bg-[#f8f9fb] rounded-lg border border-[#edeff2]">
                        {tool.category}
                      </span>
                      <span className="text-xs text-[#8b97a5]">
                        {tool.usageCount.toLocaleString("nl-NL")}x gebruikt
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-[#c5cdd6] group-hover:text-[#288978] flex-shrink-0 transition-colors" />
                </Link>
              );
            })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#288978]/10 to-[#33a370]/10 rounded-2xl p-8 border border-[#288978]/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#2c3e50] mb-2">
              Mis je een tool?
            </h2>
            <p className="text-[#415161]">
              Laat ons weten welke tools je graag zou willen zien in FIELD Assist.
            </p>
          </div>
          <button className="px-6 py-3 bg-[#288978] text-white rounded-xl hover:bg-[#1e6b5c] transition-all duration-200 font-medium shadow-md hover:shadow-lg">
            Suggestie indienen
          </button>
        </div>
      </section>
    </div>
  );
}
