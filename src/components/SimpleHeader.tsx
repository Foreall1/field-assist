"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, User, ChevronDown, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function SimpleHeader() {
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Don't show header on AI pages (they have their own header)
  if (pathname?.includes("/ai") || pathname === "/netwerk") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e8ecf0]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center shadow-lg shadow-[#288978]/20 group-hover:shadow-[#288978]/30 transition-shadow">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-[#1a2e3b] text-lg tracking-tight">FIELD</span>
              <span className="text-[#288978] font-semibold ml-1">Assist</span>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Netwerk AI Button */}
            <Link
              href="/netwerk"
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#288978]/10 to-[#33a370]/10 text-[#288978] rounded-xl font-medium hover:from-[#288978]/15 hover:to-[#33a370]/15 transition-all border border-[#288978]/10"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Netwerk AI</span>
            </Link>

            {/* Profile Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#f4f6f8] transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <ChevronDown className={`w-4 h-4 text-[#7a8a9a] transition-transform ${showProfileMenu ? "rotate-180" : ""}`} />
              </button>

              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e8ecf0] py-2 z-50 animate-fade-in-down">
                  <div className="px-4 py-3 border-b border-[#e8ecf0]">
                    <p className="font-semibold text-[#1a2e3b]">Demo Gebruiker</p>
                    <p className="text-sm text-[#7a8a9a]">Fielder bij Rotterdam</p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#415161] hover:bg-[#f4f6f8] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#7a8a9a]" />
                      Mijn profiel
                    </button>
                    <button
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#415161] hover:bg-[#f4f6f8] transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#7a8a9a]" />
                      Mijn bijdragen
                    </button>
                  </div>

                  <div className="border-t border-[#e8ecf0] pt-2">
                    <button
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Uitloggen
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
