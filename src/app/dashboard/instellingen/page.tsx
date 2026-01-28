"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  Bell,
  BellOff,
  Download,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/contexts/ToastContext";

type Theme = "light" | "dark" | "system";

export default function InstellingenPage() {
  const { user, updatePreferences, logout } = useUser();
  const { success, warning } = useToast();

  const [theme, setTheme] = useState<Theme>("system");
  const [notifications, setNotifications] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize from user preferences
  useEffect(() => {
    if (user?.preferences) {
      setTheme(user.preferences.theme || "system");
      setNotifications(user.preferences.notifications ?? true);
    }
  }, [user]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    updatePreferences({ theme: newTheme });
    success("Thema bijgewerkt");
  };

  const handleNotificationsChange = (enabled: boolean) => {
    setNotifications(enabled);
    updatePreferences({ notifications: enabled });
    success(enabled ? "Notificaties ingeschakeld" : "Notificaties uitgeschakeld");
  };

  const handleExportData = () => {
    // Export user data as JSON
    const exportData = {
      user: user,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `field-assist-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    success("Data geëxporteerd", "Uw gegevens zijn gedownload.");
  };

  const handleDeleteAccount = () => {
    // Clear all data and logout
    localStorage.clear();
    logout();
    warning("Account verwijderd", "Al uw gegevens zijn gewist.");
    window.location.href = "/";
  };

  const themes: { id: Theme; name: string; icon: typeof Sun }[] = [
    { id: "light", name: "Licht", icon: Sun },
    { id: "dark", name: "Donker", icon: Moon },
    { id: "system", name: "Systeem", icon: Monitor },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[#8b97a5] hover:text-[#288978] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar dashboard
        </Link>
        <h1 className="text-[#2c3e50] mb-2">Instellingen</h1>
        <p className="text-[#415161]">
          Pas uw voorkeuren en privacy-instellingen aan
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-white rounded-2xl border border-[#E2E7ED] p-6">
          <h2 className="text-lg font-semibold text-[#2c3e50] mb-4">
            Thema
          </h2>
          <p className="text-sm text-[#415161] mb-4">
            Kies hoe FIELD Assist eruitziet
          </p>

          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-[#288978] bg-[#288978]/5"
                      : "border-[#E2E7ED] hover:border-[#288978]/30"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? "bg-[#288978] text-white"
                        : "bg-[#f8f9fb] text-[#8b97a5]"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`font-medium ${
                      isSelected ? "text-[#288978]" : "text-[#2c3e50]"
                    }`}
                  >
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-[#8b97a5] mt-4">
            * Donker thema komt binnenkort beschikbaar
          </p>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl border border-[#E2E7ED] p-6">
          <h2 className="text-lg font-semibold text-[#2c3e50] mb-4">
            Notificaties
          </h2>
          <p className="text-sm text-[#415161] mb-4">
            Beheer hoe u op de hoogte wordt gehouden
          </p>

          <div className="flex items-center justify-between p-4 bg-[#f8f9fb] rounded-xl">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  notifications
                    ? "bg-[#288978]/10 text-[#288978]"
                    : "bg-[#E2E7ED] text-[#8b97a5]"
                }`}
              >
                {notifications ? (
                  <Bell className="w-6 h-6" />
                ) : (
                  <BellOff className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="font-medium text-[#2c3e50]">
                  Browser notificaties
                </p>
                <p className="text-sm text-[#8b97a5]">
                  Ontvang meldingen over updates en nieuwe content
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationsChange(!notifications)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                notifications ? "bg-[#288978]" : "bg-[#E2E7ED]"
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                  notifications ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white rounded-2xl border border-[#E2E7ED] p-6">
          <h2 className="text-lg font-semibold text-[#2c3e50] mb-4">
            Data & Privacy
          </h2>
          <p className="text-sm text-[#415161] mb-4">
            Beheer uw gegevens
          </p>

          <div className="space-y-3">
            {/* Export Data */}
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-4 bg-[#f8f9fb] rounded-xl hover:bg-[#edeff2] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#288978]/10 flex items-center justify-center">
                  <Download className="w-6 h-6 text-[#288978]" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#2c3e50]">
                    Exporteer mijn gegevens
                  </p>
                  <p className="text-sm text-[#8b97a5]">
                    Download een kopie van al uw data
                  </p>
                </div>
              </div>
            </button>

            {/* Delete Account */}
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-red-600">
                      Verwijder mijn account
                    </p>
                    <p className="text-sm text-red-400">
                      Wis al uw gegevens permanent
                    </p>
                  </div>
                </div>
              </button>
            ) : (
              <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-600 mb-1">
                      Weet u dit zeker?
                    </p>
                    <p className="text-sm text-red-500">
                      Deze actie kan niet ongedaan worden gemaakt. Al uw gegevens,
                      projecten en gesprekken worden permanent verwijderd.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 bg-white border border-[#E2E7ED] rounded-lg text-[#415161] font-medium hover:bg-[#f8f9fb] transition-colors"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Ja, verwijder
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center py-4">
          <p className="text-sm text-[#8b97a5]">
            FIELD Assist v1.0.0 · Demo versie
          </p>
        </div>
      </div>
    </div>
  );
}
