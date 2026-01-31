"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  UserCircle,
  Phone,
  Mail,
  Search,
  MessageCircle,
} from "lucide-react";
import { getGemeente, getGemeenteContent } from "@/lib/data";

export default function ContactenPage() {
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

  const filteredContacten = content.contacten.filter(
    (contact) =>
      contact.naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.functie.toLowerCase().includes(searchQuery.toLowerCase())
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
            <div className="w-12 h-12 rounded-xl bg-[#0ea5e9] flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2c3e50]">Contacten</h1>
              <p className="text-[#415161]">
                {content.contacten.length} contacten gedeeld door Fielders bij{" "}
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
              placeholder="Zoek contacten..."
              className="w-full pl-12 pr-4 py-3 bg-[#f8f9fb] border border-[#E2E7ED] rounded-xl focus:outline-none focus:border-[#288978] transition-colors text-[#2c3e50]"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-2 gap-4">
          {filteredContacten.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl border border-[#E2E7ED] p-6 hover:border-[#0ea5e9]/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center text-white font-bold text-xl">
                  {contact.naam.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2c3e50] mb-1">
                    {contact.naam}
                  </h3>
                  <p className="text-[#288978] font-medium text-sm mb-3">
                    {contact.functie}
                  </p>

                  <div className="space-y-2">
                    {contact.telefoon && (
                      <a
                        href={`tel:${contact.telefoon}`}
                        className="flex items-center gap-2 text-sm text-[#415161] hover:text-[#0ea5e9] transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {contact.telefoon}
                      </a>
                    )}
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-2 text-sm text-[#415161] hover:text-[#0ea5e9] transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </a>
                    )}
                  </div>

                  {contact.wanneerBenaderen && (
                    <div className="mt-4 pt-4 border-t border-[#E2E7ED]">
                      <div className="flex items-start gap-2">
                        <MessageCircle className="w-4 h-4 text-[#8b97a5] mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-[#8b97a5] mb-1">
                            Wanneer benaderen
                          </p>
                          <p className="text-sm text-[#415161]">
                            {contact.wanneerBenaderen}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredContacten.length === 0 && (
            <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-[#E2E7ED]">
              <UserCircle className="w-12 h-12 text-[#c5cdd6] mx-auto mb-3" />
              <p className="text-[#8b97a5]">
                Geen contacten gevonden voor &quot;{searchQuery}&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
