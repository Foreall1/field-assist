"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Download,
  Search,
  FileText,
  User,
} from "lucide-react";
import { getGemeente, getGemeenteContent } from "@/lib/data";

export default function HandboekenPage() {
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

  const filteredHandboeken = content.handboeken.filter(
    (handboek) =>
      handboek.titel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      handboek.beschrijving.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (handboekId: number) => {
    alert(`Download handboek ${handboekId} gestart...`);
  };

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
            <div className="w-12 h-12 rounded-xl bg-[#2dd4bf] flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2c3e50]">Handboeken</h1>
              <p className="text-[#415161]">
                {content.handboeken.length} handboeken gedeeld door Fielders bij{" "}
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
              placeholder="Zoek handboeken..."
              className="w-full pl-12 pr-4 py-3 bg-[#f8f9fb] border border-[#E2E7ED] rounded-xl focus:outline-none focus:border-[#288978] transition-colors text-[#2c3e50]"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="grid gap-4">
          {filteredHandboeken.map((handboek) => (
            <div
              key={handboek.id}
              className="bg-white rounded-2xl border border-[#E2E7ED] p-6 hover:border-[#2dd4bf]/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#2dd4bf]/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#2dd4bf]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#2c3e50] mb-1">
                      {handboek.titel}
                    </h3>
                    <p className="text-[#415161] mb-3">{handboek.beschrijving}</p>
                    <div className="flex items-center gap-4 text-sm text-[#8b97a5]">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {handboek.paginas} pagina&apos;s
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {handboek.auteur}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#2dd4bf]">
                      {handboek.downloads}
                    </p>
                    <p className="text-xs text-[#8b97a5]">downloads</p>
                  </div>
                  <button
                    onClick={() => handleDownload(handboek.id)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#2dd4bf] text-white rounded-xl hover:bg-[#14b8a6] transition-colors font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredHandboeken.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E2E7ED]">
              <BookOpen className="w-12 h-12 text-[#c5cdd6] mx-auto mb-3" />
              <p className="text-[#8b97a5]">
                Geen handboeken gevonden voor &quot;{searchQuery}&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
