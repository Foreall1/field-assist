"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Building2,
  Briefcase,
  Mail,
  Camera,
  Save,
  FileCheck,
  Shield,
  Scale,
  Map,
  BookOpen,
  MessageSquare,
  Clock,
  Award,
} from "lucide-react";
import { Avatar } from "@/components/ui";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/contexts/ToastContext";
import { UserRole } from "@/lib/types";

const roles: { id: UserRole; name: string; icon: typeof FileCheck }[] = [
  { id: "vergunningverlener", name: "Vergunningverlener", icon: FileCheck },
  { id: "toezichthouder", name: "Toezichthouder", icon: Shield },
  { id: "jurist", name: "Jurist", icon: Scale },
  { id: "beleidsmedewerker", name: "Beleidsmedewerker", icon: Map },
];

export default function ProfielPage() {
  const { user, updateUser, isLoading } = useUser();
  const { success } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    role: "" as UserRole | "",
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        organization: user.organization || "",
        role: user.role || "",
      });
    }
  }, [user]);

  // Track changes
  useEffect(() => {
    if (user) {
      const changed =
        formData.name !== user.name ||
        formData.email !== user.email ||
        formData.organization !== user.organization ||
        formData.role !== user.role;
      setHasChanges(changed);
    }
  }, [formData, user]);

  const handleSave = () => {
    if (!formData.name.trim()) return;

    updateUser({
      name: formData.name,
      email: formData.email,
      organization: formData.organization,
      role: formData.role as UserRole,
    });

    success("Profiel bijgewerkt", "Uw wijzigingen zijn opgeslagen.");
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#288978] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Stats (mock data for demo)
  const stats = [
    { label: "Artikelen gelezen", value: "47", icon: BookOpen },
    { label: "Vragen gesteld", value: "15", icon: MessageSquare },
    { label: "Actieve tijd", value: "8u 24m", icon: Clock },
    { label: "Badges verdiend", value: "3", icon: Award },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[#8b97a5] hover:text-[#288978] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar dashboard
        </Link>
        <h1 className="text-[#2c3e50] mb-2">Mijn profiel</h1>
        <p className="text-[#415161]">
          Beheer uw persoonlijke gegevens en voorkeuren
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-[#E2E7ED] p-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#E2E7ED]">
              <div className="relative">
                <Avatar name={formData.name || "Gebruiker"} size="xl" />
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#288978] text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-[#1e6b5c] transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2c3e50]">
                  {formData.name || "Uw naam"}
                </h2>
                <p className="text-[#8b97a5]">
                  {formData.organization || "Organisatie"} · {formData.role ? roles.find((r) => r.id === formData.role)?.name : "Functie"}
                </p>
                <p className="text-xs text-[#8b97a5] mt-1">
                  Lid sinds{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("nl-NL", {
                        month: "long",
                        year: "numeric",
                      })
                    : "vandaag"}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#2c3e50] mb-2">
                  Volledige naam *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b97a5]" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Uw volledige naam"
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#E2E7ED] rounded-xl focus:outline-none focus:border-[#288978] transition-colors text-[#2c3e50] placeholder:text-[#8b97a5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c3e50] mb-2">
                  E-mailadres
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b97a5]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="uw.email@organisatie.nl"
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#E2E7ED] rounded-xl focus:outline-none focus:border-[#288978] transition-colors text-[#2c3e50] placeholder:text-[#8b97a5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c3e50] mb-2">
                  Organisatie
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b97a5]" />
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                    placeholder="Uw organisatie"
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#E2E7ED] rounded-xl focus:outline-none focus:border-[#288978] transition-colors text-[#2c3e50] placeholder:text-[#8b97a5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c3e50] mb-2">
                  Functie
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = formData.role === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, role: role.id })
                        }
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          isSelected
                            ? "border-[#288978] bg-[#288978]/5"
                            : "border-[#E2E7ED] hover:border-[#288978]/30"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? "bg-[#288978] text-white"
                              : "bg-[#f8f9fb] text-[#8b97a5]"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`font-medium ${
                            isSelected ? "text-[#288978]" : "text-[#2c3e50]"
                          }`}
                        >
                          {role.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-[#E2E7ED] flex justify-end">
              <button
                onClick={handleSave}
                disabled={!hasChanges || !formData.name.trim()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  hasChanges && formData.name.trim()
                    ? "bg-[#288978] text-white hover:bg-[#1e6b5c] shadow-md hover:shadow-lg"
                    : "bg-[#E2E7ED] text-[#8b97a5] cursor-not-allowed"
                }`}
              >
                <Save className="w-5 h-5" />
                Wijzigingen opslaan
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-2xl border border-[#E2E7ED] p-6">
            <h3 className="font-semibold text-[#2c3e50] mb-4">
              Uw activiteit
            </h3>
            <div className="space-y-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#f8f9fb] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#288978]" />
                      </div>
                      <span className="text-sm text-[#415161]">{stat.label}</span>
                    </div>
                    <span className="font-semibold text-[#2c3e50]">
                      {stat.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-[#E2E7ED] p-6">
            <h3 className="font-semibold text-[#2c3e50] mb-4">
              Snelle links
            </h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/instellingen"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f8f9fb] transition-colors text-[#415161] hover:text-[#288978]"
              >
                <Briefcase className="w-5 h-5" />
                <span className="text-sm">Instellingen</span>
              </Link>
              <Link
                href="/dashboard/bladwijzers"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f8f9fb] transition-colors text-[#415161] hover:text-[#288978]"
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-sm">Mijn bladwijzers</span>
              </Link>
              <Link
                href="/projecten"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f8f9fb] transition-colors text-[#415161] hover:text-[#288978]"
              >
                <Briefcase className="w-5 h-5" />
                <span className="text-sm">Mijn projecten</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
