"use client";

import Link from "next/link";
import { ArrowLeft, History, MessageSquare, FileText, Clock } from "lucide-react";

export default function GeschiedenisPage() {
  // Placeholder data - zou uit Supabase moeten komen
  const geschiedenis = [
    {
      id: 1,
      type: "chat",
      titel: "Vraag over omgevingsvergunning",
      datum: "Vandaag, 14:30",
      preview: "Hoe vraag ik een omgevingsvergunning aan voor...",
    },
    {
      id: 2,
      type: "document",
      titel: "Template welstandsadvies gedownload",
      datum: "Gisteren, 10:15",
      preview: "Welstandsadvies template Rotterdam",
    },
    {
      id: 3,
      type: "chat",
      titel: "Handhavingsprocedure",
      datum: "2 dagen geleden",
      preview: "Wat zijn de stappen bij een handhavingsprocedure...",
    },
  ];

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
            <div className="w-12 h-12 rounded-xl bg-[#288978] flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2c3e50]">Geschiedenis</h1>
              <p className="text-[#415161]">
                Je recente activiteit en gesprekken
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="space-y-4">
          {geschiedenis.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E2E7ED] p-5 hover:border-[#288978]/30 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#288978]/10 flex items-center justify-center">
                  {item.type === "chat" ? (
                    <MessageSquare className="w-5 h-5 text-[#288978]" />
                  ) : (
                    <FileText className="w-5 h-5 text-[#288978]" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#2c3e50] mb-1">
                    {item.titel}
                  </h3>
                  <p className="text-sm text-[#415161] mb-2">{item.preview}</p>
                  <div className="flex items-center gap-2 text-xs text-[#8b97a5]">
                    <Clock className="w-3.5 h-3.5" />
                    {item.datum}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {geschiedenis.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E2E7ED]">
              <History className="w-12 h-12 text-[#c5cdd6] mx-auto mb-3" />
              <p className="text-[#8b97a5]">Nog geen geschiedenis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
