"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Building2,
  FileText,
  Users,
  ArrowRight,
  Sparkles,
  Globe,
  TrendingUp,
  Clock,
  ChevronRight,
  MapPin,
} from "lucide-react";
import {
  gemeenten,
  netwerkStats,
  zoekGemeenten,
  getTrendingTemplates,
  type Gemeente,
} from "@/lib/data";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Gemeente[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [recentGemeenten, setRecentGemeenten] = useState<string[]>([]);
  const trendingTemplates = getTrendingTemplates();

  useEffect(() => {
    const recent = localStorage.getItem("recentGemeenten");
    if (recent) {
      setRecentGemeenten(JSON.parse(recent));
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = zoekGemeenten(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const handleGemeenteClick = (gemeenteId: string) => {
    const recent = [gemeenteId, ...recentGemeenten.filter((id) => id !== gemeenteId)].slice(0, 4);
    localStorage.setItem("recentGemeenten", JSON.stringify(recent));
    setRecentGemeenten(recent);
  };

  const recentGemeenteData = recentGemeenten
    .map((id) => gemeenten.find((g) => g.id === id))
    .filter(Boolean) as Gemeente[];

  return (
    <div className="min-h-screen bg-field-hero">
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 lg:pt-12 lg:pb-24">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#288978]/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-[#33a370]/5 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[#e8ecf0]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#288978] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#288978]"></span>
              </span>
              <span className="text-sm font-medium text-[#415161]">
                {netwerkStats.totaalDocumenten}+ documenten beschikbaar
              </span>
            </div>
          </div>

          {/* Main heading */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="mb-6 animate-fade-in-up">
              Het kennisplatform voor{" "}
              <span className="text-field-gradient">Fielders</span>
            </h1>
            <p className="text-lg lg:text-xl text-[#415161] leading-relaxed max-w-2xl mx-auto animate-fade-in-up delay-100">
              Toegang tot operationele kennis van alle gemeenten waar FIELD actief is.
              Deel ervaringen, vind templates en leer van collega&apos;s.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto mb-16 animate-fade-in-up delay-200">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#288978] to-[#33a370] rounded-2xl blur-xl opacity-20" />
              <div className="relative bg-white rounded-2xl shadow-xl border border-[#e8ecf0] p-2">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8b5c4]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery && setShowResults(true)}
                    placeholder="Zoek je gemeente..."
                    className="w-full pl-14 pr-6 py-4 text-lg bg-transparent border-none focus:outline-none text-[#1a2e3b] placeholder:text-[#a8b5c4]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a8b5c4] hover:text-[#415161]"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <div className="border-t border-[#e8ecf0] mt-2 pt-2 pb-1">
                    {searchResults.map((gemeente, index) => (
                      <Link
                        key={gemeente.id}
                        href={`/gemeente/${gemeente.id}`}
                        onClick={() => handleGemeenteClick(gemeente.id)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#f4f6f8] transition-colors group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform group-hover:scale-105"
                          style={{ backgroundColor: gemeente.color }}
                        >
                          {gemeente.naam.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1a2e3b] group-hover:text-[#288978] transition-colors">
                            {gemeente.naam}
                          </p>
                          <p className="text-sm text-[#7a8a9a]">
                            {gemeente.provincie} • {gemeente.actieveFielders} Fielders
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#a8b5c4] group-hover:text-[#288978] group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                )}

                {showResults && searchQuery && searchResults.length === 0 && (
                  <div className="border-t border-[#e8ecf0] mt-2 pt-4 pb-3 text-center">
                    <p className="text-[#7a8a9a]">Geen gemeenten gevonden</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-sm text-[#7a8a9a]">Populair:</span>
              {gemeenten.slice(0, 4).map((gemeente) => (
                <Link
                  key={gemeente.id}
                  href={`/gemeente/${gemeente.id}`}
                  onClick={() => handleGemeenteClick(gemeente.id)}
                  className="text-sm font-medium text-[#288978] hover:text-[#1e6b5c] transition-colors"
                >
                  {gemeente.naam}
                </Link>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in-up delay-300">
            {[
              { icon: Building2, value: netwerkStats.totaalGemeenten, label: "Gemeenten" },
              { icon: FileText, value: netwerkStats.totaalDocumenten, label: "Documenten" },
              { icon: Users, value: netwerkStats.actieveFielders, label: "Fielders" },
              { icon: TrendingUp, value: "98%", label: "Tevredenheid" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-[#e8ecf0] text-center hover:shadow-lg transition-all hover:-translate-y-1"
                style={{ animationDelay: `${300 + index * 75}ms` }}
              >
                <stat.icon className="w-6 h-6 text-[#288978] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#1a2e3b]">{stat.value}</p>
                <p className="text-sm text-[#7a8a9a] font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Recent Gemeenten */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="icon-field">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1a2e3b]">
                    {recentGemeenteData.length > 0 ? "Recent bezocht" : "Alle gemeenten"}
                  </h2>
                  <p className="text-sm text-[#7a8a9a]">
                    {recentGemeenteData.length > 0 ? "Ga snel verder waar je was" : "Kies een gemeente om te beginnen"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 stagger">
                {(recentGemeenteData.length > 0 ? recentGemeenteData : gemeenten).map((gemeente) => (
                  <Link
                    key={gemeente.id}
                    href={`/gemeente/${gemeente.id}`}
                    onClick={() => handleGemeenteClick(gemeente.id)}
                    className="card-field-interactive flex items-center gap-4 p-4 animate-fade-in-up"
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                      style={{ backgroundColor: gemeente.color }}
                    >
                      {gemeente.naam.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1a2e3b] truncate">{gemeente.naam}</p>
                      <div className="flex items-center gap-3 text-sm text-[#7a8a9a]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {gemeente.provincie}
                        </span>
                        <span>{gemeente.actieveFielders} Fielders</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#288978]">{gemeente.totaleBijdragen}</p>
                      <p className="text-xs text-[#7a8a9a]">bijdragen</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#a8b5c4]" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Network AI & Trending */}
            <div className="space-y-8">
              {/* Network AI Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#288978] to-[#1e6b5c] p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Netwerk AI</h3>
                      <p className="text-white/70 text-sm">Vergelijk best practices</p>
                    </div>
                  </div>

                  <p className="text-white/80 mb-6 leading-relaxed">
                    Ontdek hoe andere gemeenten vergelijkbare uitdagingen aanpakken.
                    Vergelijk werkwijzen en leer van het hele netwerk.
                  </p>

                  <Link
                    href="/netwerk"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#288978] font-semibold rounded-xl hover:bg-white/90 transition-colors group"
                  >
                    <Sparkles className="w-4 h-4" />
                    Start vergelijking
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Trending Templates */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-field-soft w-10 h-10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#288978]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a2e3b]">Trending templates</h3>
                    <p className="text-sm text-[#7a8a9a]">Meest gedownload deze week</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {trendingTemplates.slice(0, 4).map((template, index) => (
                    <div
                      key={`${template.gemeente}-${template.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f4f6f8] transition-colors group cursor-pointer"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#288978]/10 flex items-center justify-center text-xs font-bold text-[#288978]">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#1a2e3b] text-sm truncate group-hover:text-[#288978] transition-colors">
                          {template.titel}
                        </p>
                        <p className="text-xs text-[#7a8a9a]">{template.gemeente}</p>
                      </div>
                      <span className="text-xs font-medium text-[#7a8a9a]">
                        {template.downloads} downloads
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-[#f4f6f8]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1a2e3b] mb-4">
            Klaar om kennis te delen?
          </h2>
          <p className="text-[#415161] mb-8 max-w-xl mx-auto">
            Deel jouw ervaringen, templates en tips met Fielders in het hele netwerk.
            Samen maken we het werk gemakkelijker.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/gemeente/rotterdam"
              className="btn-field btn-field-lg"
            >
              <Building2 className="w-5 h-5" />
              Bekijk Rotterdam
            </Link>
            <Link
              href="/netwerk"
              className="btn-field-secondary btn-field-lg"
            >
              <Globe className="w-5 h-5" />
              Netwerk AI
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
