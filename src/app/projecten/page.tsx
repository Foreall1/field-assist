"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  FolderOpen,
  FileText,
  MessageSquare,
  StickyNote,
  MoreVertical,
  Trash2,
  Edit3,
  X,
  ChevronDown,
} from "lucide-react";
import { useProjects } from "@/contexts/ProjectContext";
import { useToast } from "@/contexts/ToastContext";
import { ProjectStatus } from "@/lib/types";

const statusLabels: Record<ProjectStatus, string> = {
  actief: "Actief",
  afgerond: "Afgerond",
  gepauzeerd: "Gepauzeerd",
};

const statusColors: Record<ProjectStatus, string> = {
  actief: "bg-[#288978]/10 text-[#288978]",
  afgerond: "bg-[#8b97a5]/10 text-[#8b97a5]",
  gepauzeerd: "bg-amber-100 text-amber-700",
};

export default function ProjectenPage() {
  const { projects, createProject, deleteProject } = useProjects();
  const { success } = useToast();

  const [showNewModal, setShowNewModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "alle">("alle");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    createProject(newProjectName.trim(), newProjectDescription.trim());
    success("Project aangemaakt", `"${newProjectName}" is succesvol aangemaakt.`);
    setNewProjectName("");
    setNewProjectDescription("");
    setShowNewModal(false);
  };

  const handleDeleteProject = (id: string, name: string) => {
    deleteProject(id);
    success("Project verwijderd", `"${name}" is verwijderd.`);
    setOpenDropdownId(null);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "alle" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[#2c3e50] mb-2">Projecten</h1>
          <p className="text-[#415161]">
            Organiseer uw werk in projecten met artikelen, notities en gesprekken
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#288978] text-white rounded-xl hover:bg-[#1e6b5c] transition-colors font-medium shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nieuw project
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b97a5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek projecten..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#E2E7ED] rounded-xl focus:outline-none focus:border-[#288978] transition-colors text-[#2c3e50] placeholder:text-[#8b97a5]"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setOpenDropdownId(openDropdownId === "filter" ? null : "filter")}
            className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-[#E2E7ED] rounded-xl hover:border-[#288978]/30 transition-colors"
          >
            <span className="text-sm text-[#2c3e50]">
              Status: {statusFilter === "alle" ? "Alle" : statusLabels[statusFilter]}
            </span>
            <ChevronDown className="w-4 h-4 text-[#8b97a5]" />
          </button>
          {openDropdownId === "filter" && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-[#E2E7ED] rounded-xl shadow-lg z-10 py-1 min-w-[150px]">
              <button
                onClick={() => {
                  setStatusFilter("alle");
                  setOpenDropdownId(null);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f8f9fb] ${
                  statusFilter === "alle" ? "text-[#288978] font-medium" : "text-[#2c3e50]"
                }`}
              >
                Alle
              </button>
              {(Object.keys(statusLabels) as ProjectStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setOpenDropdownId(null);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f8f9fb] ${
                    statusFilter === status ? "text-[#288978] font-medium" : "text-[#2c3e50]"
                  }`}
                >
                  {statusLabels[status]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E2E7ED]">
          <FolderOpen className="w-16 h-16 text-[#c5cdd6] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#2c3e50] mb-2">
            {projects.length === 0 ? "Nog geen projecten" : "Geen projecten gevonden"}
          </h3>
          <p className="text-[#8b97a5] mb-6">
            {projects.length === 0
              ? "Maak uw eerste project aan om te beginnen"
              : "Probeer een andere zoekterm of filter"}
          </p>
          {projects.length === 0 && (
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#288978] text-white rounded-xl hover:bg-[#1e6b5c] transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Nieuw project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-[#E2E7ED] overflow-hidden hover:border-[#288978]/30 hover:shadow-[0_8px_30px_rgba(40,137,120,0.12)] transition-all duration-300 group"
            >
              {/* Color Bar */}
              <div
                className="h-2"
                style={{ backgroundColor: project.color }}
              />

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Link
                    href={`/projecten/${project.id}`}
                    className="flex-1"
                  >
                    <h3 className="font-semibold text-[#2c3e50] group-hover:text-[#288978] transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                  </Link>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenDropdownId(openDropdownId === project.id ? null : project.id);
                      }}
                      className="p-1.5 hover:bg-[#f8f9fb] rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-[#8b97a5]" />
                    </button>
                    {openDropdownId === project.id && (
                      <div className="absolute top-full right-0 mt-1 bg-white border border-[#E2E7ED] rounded-xl shadow-lg z-10 py-1 min-w-[140px]">
                        <Link
                          href={`/projecten/${project.id}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#2c3e50] hover:bg-[#f8f9fb]"
                        >
                          <Edit3 className="w-4 h-4" />
                          Bewerken
                        </Link>
                        <button
                          onClick={() => handleDeleteProject(project.id, project.name)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Verwijderen
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {project.description && (
                  <p className="text-sm text-[#8b97a5] mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg mb-4 ${
                    statusColors[project.status]
                  }`}
                >
                  {statusLabels[project.status]}
                </span>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-[#8b97a5]">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    {project.articleIds.length} artikelen
                  </span>
                  <span className="flex items-center gap-1.5">
                    <StickyNote className="w-4 h-4" />
                    {project.notes.length} notities
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    {project.conversationIds.length} gesprekken
                  </span>
                </div>

                {/* Updated */}
                <p className="text-xs text-[#8b97a5] mt-4 pt-4 border-t border-[#E2E7ED]">
                  Laatst bijgewerkt:{" "}
                  {new Date(project.updatedAt).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-[#E2E7ED]">
              <h2 className="text-xl font-bold text-[#2c3e50]">
                Nieuw project
              </h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-2 hover:bg-[#f8f9fb] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#8b97a5]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2c3e50] mb-2">
                  Projectnaam *
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Bijv. Vergunningsaanvraag Kerkstraat"
                  className="w-full px-4 py-3 bg-white border-2 border-[#E2E7ED] rounded-xl focus:outline-none focus:border-[#288978] transition-colors text-[#2c3e50] placeholder:text-[#8b97a5]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c3e50] mb-2">
                  Beschrijving (optioneel)
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Korte beschrijving van het project..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white border-2 border-[#E2E7ED] rounded-xl focus:outline-none focus:border-[#288978] transition-colors text-[#2c3e50] placeholder:text-[#8b97a5] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E2E7ED]">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-5 py-2.5 text-[#415161] font-medium hover:bg-[#f8f9fb] rounded-xl transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  newProjectName.trim()
                    ? "bg-[#288978] text-white hover:bg-[#1e6b5c]"
                    : "bg-[#E2E7ED] text-[#8b97a5] cursor-not-allowed"
                }`}
              >
                Aanmaken
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
