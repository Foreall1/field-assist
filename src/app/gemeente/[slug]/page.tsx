"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Users,
  FileText,
  ClipboardList,
  BookOpen,
  UserCircle,
  Lightbulb,
  Scale,
  ExternalLink,
  Sparkles,
  Plus,
  ThumbsUp,
  Send,
  ChevronRight,
  Calendar,
  Globe,
} from "lucide-react";
import {
  getGemeente,
  getGemeenteContent,
  getGemeenteBeleid,
  landelijkeWetgeving,
} from "@/lib/data";

export default function GemeenteDashboard() {
  const params = useParams();
  const gemeenteId = params.slug as string;
  const [aiQuestion, setAiQuestion] = useState("");

  const gemeente = getGemeente(gemeenteId);
  const content = getGemeenteContent(gemeenteId);
  const beleid = getGemeenteBeleid(gemeenteId);

  if (!gemeente || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 rounded-2xl bg-[#f4f6f8] flex items-center justify-center mx-auto mb-6">
            <Globe className="w-8 h-8 text-[#a8b5c4]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a2e3b] mb-3">
            Gemeente niet gevonden
          </h1>
          <p className="text-[#7a8a9a] mb-6">
            Deze gemeente bestaat niet in onze database of je hebt geen toegang.
          </p>
          <Link
            href="/"
            className="btn-field"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </Link>
        </div>
      </div>
    );
  }

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiQuestion.trim()) {
      window.location.href = `/gemeente/${gemeenteId}/ai?vraag=${encodeURIComponent(aiQuestion)}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Header */}
      <div className="bg-white border-b border-[#e8ecf0]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#7a8a9a] hover:text-[#288978] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Alle gemeenten
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Gemeente Info */}
            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg"
                style={{
                  backgroundColor: gemeente.color,
                  boxShadow: `0 8px 24px ${gemeente.color}40`
                }}
              >
                {gemeente.naam.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1a2e3b] mb-1">
                  {gemeente.naam}
                </h1>
                <div className="flex items-center gap-3 text-[#7a8a9a]">
                  <span>{gemeente.provincie}</span>
                  <span className="w-1 h-1 rounded-full bg-[#d4dbe3]" />
                  <span>{gemeente.inwoners.toLocaleString("nl-NL")} inwoners</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Link
              href={`/gemeente/${gemeenteId}/toevoegen`}
              className="btn-field btn-field-lg self-start lg:self-auto"
            >
              <Plus className="w-5 h-5" />
              Kennis toevoegen
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-8 pt-6 border-t border-[#e8ecf0]">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#288978]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#288978]" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#1a2e3b]">{gemeente.actieveFielders}</p>
                <p className="text-sm text-[#7a8a9a]">actieve Fielders</p>
              </div>
            </div>
            <div className="w-px h-10 bg-[#e8ecf0]" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#288978]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#288978]" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#1a2e3b]">{gemeente.totaleBijdragen}</p>
                <p className="text-sm text-[#7a8a9a]">bijdragen</p>
              </div>
            </div>
            <div className="w-px h-10 bg-[#e8ecf0]" />
            <div className="flex items-center gap-2 text-[#7a8a9a]">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Laatste update: {gemeente.laatsteUpdate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
        {/* FIELD Kennis Section */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="icon-field icon-field-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a2e3b]">
                FIELD Kennis
              </h2>
              <p className="text-[#7a8a9a]">
                Gedeeld door Fielders bij {gemeente.naam}
              </p>
            </div>
          </div>

          {/* Content Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { href: `processen`, icon: ClipboardList, label: "Processen", count: content.processen.length, color: "#288978" },
              { href: `templates`, icon: FileText, label: "Templates", count: content.templates.length, color: "#33a370" },
              { href: `handboeken`, icon: BookOpen, label: "Handboeken", count: content.handboeken.length, color: "#2dd4bf" },
              { href: `contacten`, icon: UserCircle, label: "Contacten", count: content.contacten.length, color: "#0ea5e9" },
            ].map((item) => (
              <Link
                key={item.href}
                href={`/gemeente/${gemeenteId}/${item.href}`}
                className="card-field-interactive group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <h3 className="font-semibold text-[#1a2e3b] mb-1 group-hover:text-[#288978] transition-colors">
                  {item.label}
                </h3>
                <p className="text-3xl font-bold" style={{ color: item.color }}>
                  {item.count}
                </p>
              </Link>
            ))}
          </div>

          {/* Tips Section */}
          {content.tips.length > 0 && (
            <div className="bg-gradient-to-br from-[#288978]/5 via-[#33a370]/5 to-transparent rounded-2xl border border-[#288978]/10 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#288978]/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-[#288978]" />
                </div>
                <h3 className="font-bold text-[#1a2e3b]">
                  Tips van collega&apos;s
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {content.tips.slice(0, 2).map((tip) => (
                  <div
                    key={tip.id}
                    className="bg-white rounded-xl p-5 border border-[#e8ecf0] shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="text-[#415161] mb-4 leading-relaxed">
                      &quot;{tip.tekst}&quot;
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#7a8a9a] font-medium">
                        — {tip.auteur}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-[#288978]">
                        <ThumbsUp className="w-4 h-4" />
                        {tip.likes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Openbaar Beleid */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Scale className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-[#1a2e3b]">Openbaar beleid</h2>
                <p className="text-sm text-[#7a8a9a]">Officiële {gemeente.naam} documenten</p>
              </div>
            </div>

            <div className="card-field p-0 overflow-hidden">
              {beleid.map((doc, index) => (
                <a
                  key={index}
                  href={doc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 hover:bg-[#f4f6f8] transition-colors border-b border-[#e8ecf0] last:border-b-0 group"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-medium text-[#1a2e3b] group-hover:text-[#288978] transition-colors truncate">
                      {doc.titel}
                    </p>
                    <p className="text-sm text-[#7a8a9a]">{doc.type}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#a8b5c4] group-hover:text-[#288978] flex-shrink-0" />
                </a>
              ))}
            </div>
          </section>

          {/* Landelijke Wetgeving */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-bold text-[#1a2e3b]">Landelijke wetgeving</h2>
                <p className="text-sm text-[#7a8a9a]">Rijksoverheid documenten</p>
              </div>
            </div>

            <div className="card-field p-0 overflow-hidden">
              {landelijkeWetgeving.slice(0, 5).map((wet, index) => (
                <a
                  key={index}
                  href={wet.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 hover:bg-[#f4f6f8] transition-colors border-b border-[#e8ecf0] last:border-b-0 group"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-medium text-[#1a2e3b] group-hover:text-[#288978] transition-colors truncate">
                      {wet.titel}
                    </p>
                    <p className="text-sm text-[#7a8a9a] truncate">{wet.beschrijving}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#a8b5c4] group-hover:text-[#288978] flex-shrink-0" />
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* AI Section */}
        <section>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#288978] via-[#288978] to-[#1e6b5c] p-8 lg:p-10">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#33a370]/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />

            <div className="relative">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {gemeente.naam} AI
                      </h2>
                      <p className="text-white/70">
                        Zoekt in alle {gemeente.naam} kennis
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/gemeente/${gemeenteId}/ai`}
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Volledige AI chat
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <form onSubmit={handleAskAI} className="mt-6">
                <div className="relative">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder={`Stel een vraag over ${gemeente.naam}...`}
                    className="w-full px-6 py-4 pr-16 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-[#288978] hover:bg-white/90 transition-colors shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap items-center gap-3 mt-5">
                <span className="text-white/50 text-sm">Suggesties:</span>
                {["Welstandsadvies", "Vergunningprocedure", "Handhaving"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setAiQuestion(`Hoe werkt ${suggestion.toLowerCase()}?`)}
                    className="text-sm bg-white/10 hover:bg-white/20 text-white/90 px-4 py-2 rounded-lg transition-colors border border-white/10"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
