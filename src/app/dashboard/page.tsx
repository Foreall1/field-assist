"use client";

import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  Clock,
  Settings,
  TrendingUp,
  Calendar,
  ChevronRight,
  Eye,
  MessageSquare,
  Award,
  Target,
  FolderOpen,
  User,
} from "lucide-react";
import { Avatar } from "@/components/ui";
import { useUser } from "@/contexts/UserContext";

const stats = [
  { label: "Artikelen gelezen", value: "47", icon: BookOpen, change: "+12 deze maand" },
  { label: "Opgeslagen items", value: "23", icon: Bookmark, change: "3 nieuw" },
  { label: "Leestijd totaal", value: "8u 24m", icon: Clock, change: "+2u deze week" },
  { label: "Vragen gesteld", value: "15", icon: MessageSquare, change: "+5 deze week" },
];

const recentActivity = [
  {
    id: 1,
    type: "read",
    title: "Nieuwe Omgevingswet: de belangrijkste wijzigingen",
    time: "2 uur geleden",
    category: "Vergunningverlening",
  },
  {
    id: 2,
    type: "bookmark",
    title: "Handhavingsstrategie bij illegale bouw",
    time: "5 uur geleden",
    category: "Handhaving",
  },
  {
    id: 3,
    type: "question",
    title: "Gesprek over termijnen vergunningprocedure",
    time: "1 dag geleden",
    category: "AI Assistent",
  },
  {
    id: 4,
    type: "read",
    title: "Bezwaarprocedures onder de Awb",
    time: "2 dagen geleden",
    category: "Juridisch",
  },
  {
    id: 5,
    type: "tool",
    title: "Termijncalculator gebruikt",
    time: "3 dagen geleden",
    category: "Tools",
  },
];

const savedArticles = [
  {
    id: 1,
    title: "Vergunningvrij bouwen onder de Omgevingswet",
    category: "Vergunningverlening",
    savedAt: "2024-01-20",
  },
  {
    id: 2,
    title: "Last onder dwangsom: hoogte en begunstigingstermijn",
    category: "Handhaving",
    savedAt: "2024-01-18",
  },
  {
    id: 3,
    title: "Participatie bij omgevingsvergunningen",
    category: "Ruimtelijke Ordening",
    savedAt: "2024-01-15",
  },
];

const sidebarLinks = [
  { href: "/dashboard", label: "Overzicht", icon: TrendingUp, active: true },
  { href: "/dashboard/profiel", label: "Mijn Profiel", icon: User },
  { href: "/projecten", label: "Projecten", icon: FolderOpen },
  { href: "/dashboard/bladwijzers", label: "Bladwijzers", icon: Bookmark },
  { href: "/dashboard/geschiedenis", label: "Leesgeschiedenis", icon: Clock },
  { href: "/dashboard/instellingen", label: "Instellingen", icon: Settings },
];

const roleLabels: Record<string, string> = {
  vergunningverlener: "Vergunningverlener",
  toezichthouder: "Toezichthouder",
  jurist: "Jurist",
  beleidsmedewerker: "Beleidsmedewerker",
};

export default function DashboardPage() {
  const { user } = useUser();

  const userName = user?.name || "Gebruiker";
  const userRole = user?.role ? roleLabels[user.role] : "Gebruiker";

  return (
    <div className="flex gap-8 -mx-8 -my-8 min-h-[calc(100vh-130px)]">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-[#f8f9fb] to-white border-r border-[#E2E7ED] p-6 flex-shrink-0">
        {/* User Info */}
        <Link
          href="/dashboard/profiel"
          className="flex items-center gap-4 mb-8 p-4 bg-white rounded-2xl border border-[#E2E7ED] shadow-sm hover:border-[#288978]/30 hover:shadow-md transition-all"
        >
          <Avatar name={userName} size="lg" />
          <div>
            <p className="font-semibold text-[#2c3e50]">{userName}</p>
            <p className="text-sm text-[#8b97a5]">{userRole}</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  link.active
                    ? "bg-[#288978] text-white shadow-md"
                    : "text-[#415161] hover:bg-white hover:text-[#2c3e50] hover:shadow-sm"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Achievement Preview */}
        <div className="mt-8 p-5 bg-gradient-to-br from-[#288978]/10 to-[#33a370]/10 rounded-2xl border border-[#288978]/20">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-[#288978]" />
            <span className="font-semibold text-[#2c3e50]">Badges</span>
          </div>
          <p className="text-sm text-[#415161] mb-4">
            Je hebt 3 badges verdiend!
          </p>
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#33a370] to-[#288978] rounded-xl flex items-center justify-center shadow-md">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#288978] to-[#1e6b5c] rounded-xl flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white">
        <div className="max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[#2c3e50] mb-2">Dashboard</h1>
            <p className="text-[#415161]">
              Welkom terug! Hier is een overzicht van je activiteit.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border border-[#E2E7ED] p-5 hover:border-[#288978]/30 hover:shadow-[0_8px_30px_rgba(40,137,120,0.08)] transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#288978]/10 to-[#33a370]/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#288978]" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#2c3e50] mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#8b97a5]">{stat.label}</p>
                  <p className="text-xs text-[#288978] mt-2 font-medium">{stat.change}</p>
                </div>
              );
            })}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#2c3e50]">
                  Recente activiteit
                </h2>
                <Link
                  href="/dashboard/geschiedenis"
                  className="text-sm text-[#288978] hover:text-[#1e6b5c] font-medium"
                >
                  Bekijk alles
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E7ED] overflow-hidden">
                {recentActivity.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-4 p-4 hover:bg-[#f8f9fb] transition-colors ${
                      index !== recentActivity.length - 1 ? "border-b border-[#E2E7ED]" : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activity.type === "read"
                          ? "bg-blue-50"
                          : activity.type === "bookmark"
                          ? "bg-amber-50"
                          : activity.type === "question"
                          ? "bg-purple-50"
                          : "bg-[#288978]/10"
                      }`}
                    >
                      {activity.type === "read" && (
                        <Eye className="w-5 h-5 text-blue-600" />
                      )}
                      {activity.type === "bookmark" && (
                        <Bookmark className="w-5 h-5 text-amber-600" />
                      )}
                      {activity.type === "question" && (
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                      )}
                      {activity.type === "tool" && (
                        <Calendar className="w-5 h-5 text-[#288978]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2c3e50] truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-[#288978] bg-[#288978]/10 rounded-md">
                          {activity.category}
                        </span>
                        <span className="text-xs text-[#8b97a5]">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Articles */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#2c3e50]">
                  Opgeslagen artikelen
                </h2>
                <Link
                  href="/dashboard/bladwijzers"
                  className="text-sm text-[#288978] hover:text-[#1e6b5c] font-medium"
                >
                  Bekijk alles
                </Link>
              </div>

              <div className="space-y-3">
                {savedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href="#"
                    className="block bg-white rounded-2xl border border-[#E2E7ED] p-5 hover:border-[#288978]/30 hover:shadow-[0_8px_30px_rgba(40,137,120,0.08)] transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-[#288978] bg-[#288978]/10 rounded-lg mb-2">
                          {article.category}
                        </span>
                        <h3 className="font-medium text-[#2c3e50] group-hover:text-[#288978] transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-xs text-[#8b97a5] mt-2">
                          Opgeslagen op{" "}
                          {new Date(article.savedAt).toLocaleDateString("nl-NL")}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#c5cdd6] group-hover:text-[#288978] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Continue Reading Suggestion */}
              <div className="mt-6 p-5 bg-gradient-to-r from-[#288978]/10 to-[#33a370]/10 rounded-2xl border border-[#288978]/20">
                <h3 className="font-semibold text-[#2c3e50] mb-2">
                  Verder lezen?
                </h3>
                <p className="text-sm text-[#415161] mb-3">
                  Je was begonnen met &quot;Termijnen in de vergunningprocedure&quot;
                </p>
                <Link
                  href="#"
                  className="text-sm text-[#288978] hover:text-[#1e6b5c] font-medium inline-flex items-center gap-1 group"
                >
                  Verder lezen
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
