"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, User, ChevronDown, LogIn, LogOut, Home, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/contexts/UserContext";

export function SimpleHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isLoading } = useUser();
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

  const handleSignOut = async () => {
    setShowProfileMenu(false);
    await signOut();
    router.push("/");
  };

  // Don't show header on certain pages
  if (pathname?.includes("/ai") && !pathname?.includes("/assistent")) {
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

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/" ? "text-[#288978]" : "text-[#7a8a9a] hover:text-[#288978]"
              }`}
            >
              Gemeenten
            </Link>
            <Link
              href="/assistent"
              className={`text-sm font-medium transition-colors ${
                pathname === "/assistent" ? "text-[#288978]" : "text-[#7a8a9a] hover:text-[#288978]"
              }`}
            >
              AI Assistent
            </Link>
            <Link
              href="/bibliotheek"
              className={`text-sm font-medium transition-colors ${
                pathname?.startsWith("/bibliotheek") ? "text-[#288978]" : "text-[#7a8a9a] hover:text-[#288978]"
              }`}
            >
              Bibliotheek
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Netwerk AI Button */}
            <Link
              href="/netwerk"
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#288978]/10 to-[#33a370]/10 text-[#288978] rounded-xl font-medium hover:from-[#288978]/15 hover:to-[#33a370]/15 transition-all border border-[#288978]/10"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Netwerk</span>
            </Link>

            {/* Auth Section */}
            {isLoading ? (
              <div className="w-9 h-9 rounded-xl bg-[#f4f6f8] animate-pulse" />
            ) : user ? (
              /* Logged In - Profile Menu */
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#f4f6f8] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#7a8a9a] transition-transform ${showProfileMenu ? "rotate-180" : ""}`} />
                </button>

                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e8ecf0] py-2 z-50">
                    <div className="px-4 py-3 border-b border-[#e8ecf0]">
                      <p className="font-semibold text-[#1a2e3b]">{user.name || "Gebruiker"}</p>
                      <p className="text-sm text-[#7a8a9a]">{user.organization || user.email}</p>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#415161] hover:bg-[#f4f6f8] transition-colors"
                      >
                        <Home className="w-4 h-4 text-[#7a8a9a]" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profiel"
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#415161] hover:bg-[#f4f6f8] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#7a8a9a]" />
                        Mijn profiel
                      </Link>
                      <Link
                        href="/dashboard/instellingen"
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#415161] hover:bg-[#f4f6f8] transition-colors"
                      >
                        <Settings className="w-4 h-4 text-[#7a8a9a]" />
                        Instellingen
                      </Link>
                    </div>

                    <div className="border-t border-[#e8ecf0] pt-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Uitloggen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not Logged In - Login/Register */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#415161] hover:text-[#288978] transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Inloggen</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-[#288978] text-white text-sm font-medium rounded-xl hover:bg-[#1e6b5c] transition-colors"
                >
                  Registreren
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
