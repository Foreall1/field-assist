import Link from "next/link";
import { Bell, FileText, RefreshCw, Scale, Wrench, ArrowRight } from "lucide-react";
import updatesData from "@/data/updates.json";

const typeConfig = {
  article: {
    icon: FileText,
    label: "Artikel",
    color: "bg-blue-50 text-blue-600",
    dotColor: "bg-blue-500",
  },
  update: {
    icon: RefreshCw,
    label: "Update",
    color: "bg-[#288978]/10 text-[#288978]",
    dotColor: "bg-[#288978]",
  },
  law: {
    icon: Scale,
    label: "Wetgeving",
    color: "bg-purple-50 text-purple-600",
    dotColor: "bg-purple-500",
  },
  tool: {
    icon: Wrench,
    label: "Tool",
    color: "bg-amber-50 text-amber-600",
    dotColor: "bg-amber-500",
  },
};

export function RecentUpdates() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center shadow-sm">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2c3e50]">
              Recente updates
            </h2>
            <p className="text-sm text-[#8b97a5]">Nieuws & wijzigingen</p>
          </div>
        </div>
        <Link
          href="/nieuws"
          className="text-[#288978] hover:text-[#1e6b5c] flex items-center gap-1 text-sm font-medium group"
        >
          Alle updates
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E7ED] overflow-hidden">
        {updatesData.map((update, index) => {
          const config = typeConfig[update.type as keyof typeof typeConfig];
          const Icon = config.icon;

          return (
            <Link
              key={update.id}
              href={update.link}
              className={`flex items-start gap-4 p-4 hover:bg-[#f8f9fb] transition-colors group ${
                index !== updatesData.length - 1 ? "border-b border-[#E2E7ED]" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-[#2c3e50] truncate group-hover:text-[#288978] transition-colors">
                    {update.title}
                  </h3>
                  {update.isNew && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-[#33a370] bg-[#33a370]/10 rounded-md">
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} />
                      Nieuw
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#415161] line-clamp-1">
                  {update.description}
                </p>
              </div>

              <span className="text-xs text-[#8b97a5] flex-shrink-0 bg-[#f8f9fb] px-2 py-1 rounded-md">
                {new Date(update.date).toLocaleDateString("nl-NL", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
