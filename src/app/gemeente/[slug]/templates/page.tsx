"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Download,
  Lightbulb,
  Search,
  Plus,
  Loader2,
} from "lucide-react";
import { getGemeente } from "@/lib/data";
import { getSupabaseClient } from "@/lib/supabase";

interface Template {
  id: string;
  titel: string;
  beschrijving: string;
  bestandstype: string;
  versie?: string;
  auteur_naam: string;
  tip?: string;
  downloads: number;
  file_url?: string;
  created_at: string;
}

export default function TemplatesPage() {
  const params = useParams();
  const gemeenteId = params.slug as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const gemeente = getGemeente(gemeenteId);
  const supabase = getSupabaseClient();

  useEffect(() => {
    async function loadTemplates() {
      try {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .eq('gemeente_id', gemeenteId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading templates:', error);
        } else {
          setTemplates(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadTemplates();
  }, [gemeenteId, supabase]);

  if (!gemeente) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#8b97a5]">Gemeente niet gevonden</p>
      </div>
    );
  }

  const filteredTemplates = templates.filter(
    (template) =>
      template.titel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.beschrijving?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (template: Template) => {
    if (template.file_url) {
      window.open(template.file_url, '_blank');
    } else {
      alert('Geen bestand beschikbaar voor download');
    }
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

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#288978] flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2c3e50]">Templates</h1>
                <p className="text-[#415161]">
                  {templates.length} templates gedeeld door Fielders bij{" "}
                  {gemeente.naam}
                </p>
              </div>
            </div>
            <Link
              href={`/gemeente/${gemeenteId}/toevoegen?type=template`}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#288978] text-white rounded-xl hover:bg-[#1e6b5c] transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Template toevoegen
            </Link>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b97a5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek templates..."
              className="w-full pl-12 pr-4 py-3 bg-[#f8f9fb] border border-[#E2E7ED] rounded-xl focus:outline-none focus:border-[#288978] transition-colors text-[#2c3e50]"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#288978] animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-2xl border border-[#E2E7ED] p-6 hover:border-[#288978]/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#288978]/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#288978]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2c3e50] mb-1">
                        {template.titel}
                      </h3>
                      <p className="text-[#415161] mb-2">{template.beschrijving}</p>
                      <div className="flex items-center gap-4 text-sm text-[#8b97a5]">
                        <span>{template.bestandstype}</span>
                        {template.versie && <span>Versie {template.versie}</span>}
                        <span>Door {template.auteur_naam}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#288978]">
                        {template.downloads}
                      </p>
                      <p className="text-xs text-[#8b97a5]">downloads</p>
                    </div>
                    <button
                      onClick={() => handleDownload(template)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#288978] text-white rounded-xl hover:bg-[#1e6b5c] transition-colors font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>

                {template.tip && (
                  <div className="mt-4 pt-4 border-t border-[#E2E7ED]">
                    <div className="flex items-start gap-3 bg-[#288978]/5 rounded-xl p-4">
                      <Lightbulb className="w-5 h-5 text-[#288978] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-[#288978] mb-1">
                          Tip van {template.auteur_naam}
                        </p>
                        <p className="text-sm text-[#415161]">{template.tip}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredTemplates.length === 0 && !isLoading && (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#E2E7ED]">
                <FileText className="w-12 h-12 text-[#c5cdd6] mx-auto mb-3" />
                <p className="text-[#8b97a5] mb-4">
                  {searchQuery
                    ? `Geen templates gevonden voor "${searchQuery}"`
                    : "Nog geen templates toegevoegd"}
                </p>
                <Link
                  href={`/gemeente/${gemeenteId}/toevoegen?type=template`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#288978] text-white rounded-xl hover:bg-[#1e6b5c] transition-colors font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Eerste template toevoegen
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
