"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Sparkles,
  ChevronDown,
  BookOpen,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  FolderOpen,
  User,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Avatar } from "@/components/ui";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/bibliotheek", label: "Bibliotheek" },
  { href: "/assistent", label: "Assistent", icon: Sparkles },
  { href: "/projecten", label: "Projecten" },
  { href: "/tools", label: "Tools" },
  { href: "/dashboard", label: "Dashboard" },
];

const notifications = [
  {
    id: 1,
    title: "Nieuw artikel gepubliceerd",
    message: "Energielabel C-verplichting uitgesteld",
    time: "2 uur geleden",
    unread: true,
  },
  {
    id: 2,
    title: "Checklist geactualiseerd",
    message: "Omgevingsvergunning checklist bijgewerkt",
    time: "1 dag geleden",
    unread: true,
  },
  {
    id: 3,
    title: "Wetswijziging",
    message: "Besluit bouwwerken leefomgeving aangepast",
    time: "3 dagen geleden",
    unread: false,
  },
];

const roleLabels: Record<string, string> = {
  vergunningverlener: "Vergunningverlener",
  toezichthouder: "Toezichthouder",
  jurist: "Jurist",
  beleidsmedewerker: "Beleidsmedewerker",
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await signOut();
    setShowUserMenu(false);
    router.push("/");
  };

  const userName = user?.name || "Gebruiker";
  const userRole = user?.role ? roleLabels[user.role] : "Gebruiker";
  const userOrganization = user?.organization || "";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2E7ED]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-[#288978] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#288978] font-bold text-xl tracking-tight leading-none">
                FIELD
              </span>
              <span className="text-[#8b97a5] text-[10px] font-medium tracking-wide uppercase">
                Assist
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-[15px] font-medium
                    transition-all duration-200
                    ${active
                      ? "text-[#288978] bg-[#288978]/5"
                      : "text-[#415161] hover:text-[#288978] hover:bg-[#f8f9fb]"
                    }
                  `}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#288978] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2.5 rounded-lg text-[#415161] hover:text-[#288978] hover:bg-[#f8f9fb] transition-all duration-200"
                aria-label="Notificaties"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#33a370] rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#E2E7ED] overflow-hidden animate-field-slide-up">
                  <div className="px-4 py-3 border-b border-[#E2E7ED] bg-[#f8f9fb]">
                    <h3 className="font-semibold text-[#2c3e50] text-sm">Notificaties</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <button
                        key={notif.id}
                        className="w-full text-left px-4 py-3 hover:bg-[#f8f9fb] transition-colors border-b border-[#E2E7ED] last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              notif.unread ? "bg-[#288978]" : "bg-transparent"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#2c3e50]">
                              {notif.title}
                            </p>
                            <p className="text-sm text-[#8b97a5] truncate">
                              {notif.message}
                            </p>
                            <p className="text-xs text-[#c5cdd6] mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-[#E2E7ED] bg-[#f8f9fb]">
                    <Link
                      href="/notificaties"
                      className="text-sm text-[#288978] hover:text-[#1e6b5c] font-medium"
                    >
                      Alle notificaties bekijken
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#f8f9fb] transition-all duration-200"
              >
                {user ? (
                  <Avatar name={userName} size="sm" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#E2E7ED] flex items-center justify-center text-[#8b97a5]">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span className="text-sm font-medium text-[#2c3e50] hidden md:block">
                  {userName.split(" ")[0]}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#8b97a5] transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-[#E2E7ED] overflow-hidden animate-field-slide-up">
                  <div className="px-4 py-4 border-b border-[#E2E7ED] bg-gradient-to-br from-[#288978] to-[#33a370]">
                    <p className="font-semibold text-white">
                      {userName}
                    </p>
                    <p className="text-sm text-white/80">{userRole}</p>
                    {userOrganization && (
                      <p className="text-xs text-white/60 mt-1">{userOrganization}</p>
                    )}
                  </div>
                  <div className="py-2">
                    {!user?.onboardingComplete && (
                      <Link
                        href="/onboarding"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#288978] bg-[#288978]/5 hover:bg-[#288978]/10 transition-colors font-medium"
                      >
                        <Sparkles className="w-4 h-4" />
                        Profiel instellen
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#415161] hover:text-[#288978] hover:bg-[#f8f9fb] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profiel"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#415161] hover:text-[#288978] hover:bg-[#f8f9fb] transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Mijn profiel
                    </Link>
                    <Link
                      href="/projecten"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#415161] hover:text-[#288978] hover:bg-[#f8f9fb] transition-colors"
                    >
                      <FolderOpen className="w-4 h-4" />
                      Mijn projecten
                    </Link>
                    <Link
                      href="/dashboard/bladwijzers"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#415161] hover:text-[#288978] hover:bg-[#f8f9fb] transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      Mijn bladwijzers
                    </Link>
                    <Link
                      href="/dashboard/instellingen"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#415161] hover:text-[#288978] hover:bg-[#f8f9fb] transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Instellingen
                    </Link>
                  </div>
                  {user && (
                    <div className="border-t border-[#E2E7ED] py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Uitloggen
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg text-[#415161] hover:text-[#288978] hover:bg-[#f8f9fb] transition-all duration-200"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#E2E7ED] animate-field-slide-up">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-lg text-[15px] font-medium
                      transition-all duration-200
                      ${active
                        ? "text-[#288978] bg-[#288978]/5"
                        : "text-[#415161] hover:text-[#288978] hover:bg-[#f8f9fb]"
                      }
                    `}
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
}
