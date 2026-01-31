"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark, FileText, ClipboardList, BookOpen, Trash2 } from "lucide-react";

export default function BladwijzersPage() {
  // Placeholder data - zou uit Supabase moeten komen
  const bladwijzers = [
    {
      id: 1,
      type: "template",
      titel: "Welstandsadvies template",
      gemeente: "Rotterdam",
      datumOpgeslagen: "15 jan 2024",
    },
    {
      id: 2,
      type: "proces",
      titel: "Omgevingsvergunning procedure",
      gemeente: "Amsterdam",
      datumOpgeslagen: "12 jan 2024",
    },
    {
      id: 3,
      type: "handboek",
      titel: "VTH Handboek 2024",
      gemeente: "Utrecht",
      datumOpgeslagen: "10 jan 2024",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "template":
        return <FileText className="w-5 h-5 text-[#288978]" />;
      case "proces":
        return <ClipboardList className="w-5 h-5 text-[#288978]" />;
      case "handboek":
        return <BookOpen className="w-5 h-5 text-[#2dd4bf]" />;
      default:
        return <Bookmark className="w-5 h-5 text-[#288978]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E7ED]">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[#8b97a5] hover:text-[#288978] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar dashboard
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2c3e50]">Bladwijzers</h1>
              <p className="text-[#415161]">
                Je opgeslagen documenten en processen
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="space-y-4">
          {bladwijzers.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E2E7ED] p-5 hover:border-[#288978]/30 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#288978]/10 flex items-center justify-center">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2c3e50] mb-1">
                      {item.titel}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-[#8b97a5]">
                      <span>{item.gemeente}</span>
                      <span className="w-1 h-1 rounded-full bg-[#d4dbe3]" />
                      <span>Opgeslagen op {item.datumOpgeslagen}</span>
                    </div>
                  </div>
                </div>

                <button className="p-2 text-[#8b97a5] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {bladwijzers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E2E7ED]">
              <Bookmark className="w-12 h-12 text-[#c5cdd6] mx-auto mb-3" />
              <p className="text-[#8b97a5]">Nog geen bladwijzers</p>
              <p className="text-sm text-[#8b97a5] mt-1">
                Sla documenten en processen op om ze hier terug te vinden
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
