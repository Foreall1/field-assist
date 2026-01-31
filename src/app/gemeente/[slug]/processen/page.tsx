"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ClipboardList,
  ChevronRight,
  Search,
  User,
} from "lucide-react";
import { getGemeente, getGemeenteContent } from "@/lib/data";

export default function ProcessenPage() {
  const params = useParams();
  const gemeenteId = params.slug as string;
  const [searchQuery, setSearchQuery] = useState("");

  const gemeente = getGemeente(gemeenteId);
  const content = getGemeenteContent(gemeenteId);

  if (!gemeente || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#8b97a5]">Gemeente niet gevonden</p>
      </div>
    );
  }

  const filteredProcessen = content.processen.filter(
    (proces) =>
      proces.titel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proces.beschrijving.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E7ED]">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <Link
            href={`/gemeente/${gemeenteId}`}
            className="inline-flex items-center gap-2 text-sm text-[#8b97a5] hover:text-[#288978] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar {gemeente.naam}
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#288978] flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2c3e50]">Processen</h1>
              <p className="text-[#415161]">
                {content.processen.length} processen gedeeld door Fielders bij{" "}
                {gemeente.naam}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b97a5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek processen..."
              className="w-full pl-12 pr-4 py-3 bg-[#f8f9fb] border border-[#E2E7ED] rounded-xl focus:outline-none focus:border-[#288978] transition-colors text-[#2c3e50]"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="grid gap-4">
          {filteredProcessen.map((proces) => (
            <div
              key={proces.id}
              className="bg-white rounded-2xl border border-[#E2E7ED] p-6 hover:border-[#288978]/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#288978]/10 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-[#288978]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#2c3e50] mb-1">
                      {proces.titel}
                    </h3>
                    <p className="text-[#415161] mb-2">{proces.beschrijving}</p>
                    <div className="flex items-center gap-2 text-sm text-[#8b97a5]">
                      <User className="w-4 h-4" />
                      <span>Door {proces.auteur}</span>
                    </div>
                  </div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#288978] text-white rounded-xl hover:bg-[#1e6b5c] transition-colors font-medium">
                  Bekijk
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Stappen preview */}
              {proces.stappen && proces.stappen.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#E2E7ED]">
                  <p className="text-sm font-medium text-[#2c3e50] mb-3">
                    {proces.stappen.length} stappen
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {proces.stappen.slice(0, 4).map((stap, index) => (
                      <span
                        key={index}
                        className="text-xs bg-[#f4f6f8] text-[#415161] px-3 py-1.5 rounded-lg"
                      >
                        {index + 1}. {stap}
                      </span>
                    ))}
                    {proces.stappen.length > 4 && (
                      <span className="text-xs bg-[#288978]/10 text-[#288978] px-3 py-1.5 rounded-lg">
                        +{proces.stappen.length - 4} meer
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredProcessen.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E2E7ED]">
              <ClipboardList className="w-12 h-12 text-[#c5cdd6] mx-auto mb-3" />
              <p className="text-[#8b97a5]">
                Geen processen gevonden voor &quot;{searchQuery}&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
