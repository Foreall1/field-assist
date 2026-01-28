import Link from "next/link";
import { TrendingUp, Clock, Eye, ArrowRight } from "lucide-react";
import trendingData from "@/data/trending.json";

export function TrendingArticles() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center shadow-sm">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2c3e50]">
              Trending artikelen
            </h2>
            <p className="text-sm text-[#8b97a5]">Meest gelezen deze week</p>
          </div>
        </div>
        <Link
          href="/bibliotheek"
          className="text-[#288978] hover:text-[#1e6b5c] flex items-center gap-1 text-sm font-medium group"
        >
          Bekijk alle
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="space-y-4">
        {trendingData.map((article, index) => (
          <Link
            key={article.id}
            href={`/bibliotheek/${article.categorySlug}/${article.slug}`}
            className="group flex gap-5 bg-white rounded-2xl border border-[#E2E7ED] p-5 hover:border-[#288978]/30 hover:shadow-[0_8px_30px_rgba(40,137,120,0.12)] transition-all duration-300"
          >
            {/* Rank indicator */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#f8f9fb] to-[#edeff2] flex items-center justify-center">
              <span className="text-2xl font-bold text-[#288978]">{index + 1}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-[#288978] bg-[#288978]/10 rounded-lg">
                  {article.category}
                </span>
                {index === 0 && (
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-[#33a370] bg-[#33a370]/10 rounded-lg">
                    Meest gelezen
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-[#2c3e50] mb-2 line-clamp-1 group-hover:text-[#288978] transition-colors">
                {article.title}
              </h3>

              <p className="text-sm text-[#415161] line-clamp-2 mb-3">
                {article.summary}
              </p>

              <div className="flex items-center gap-4 text-xs text-[#8b97a5]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime} min leestijd
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {article.views.toLocaleString("nl-NL")} views
                </span>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-[#c5cdd6] group-hover:text-[#288978] flex-shrink-0 self-center transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}
