"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  StickyNote,
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  Save,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useProjects } from "@/contexts/ProjectContext";
import { useChat } from "@/contexts/ChatContext";
import { useToast } from "@/contexts/ToastContext";
import { ProjectStatus } from "@/lib/types";
import articles from "@/data/articles.json";

const statusLabels: Record<ProjectStatus, string> = {
  actief: "Actief",
  afgerond: "Afgerond",
  gepauzeerd: "Gepauzeerd",
};

const statusColors: Record<ProjectStatus, string> = {
  actief: "bg-[#288978]/10 text-[#288978] border-[#288978]/20",
  afgerond: "bg-[#8b97a5]/10 text-[#8b97a5] border-[#8b97a5]/20",
  gepauzeerd: "bg-amber-100 text-amber-700 border-amber-200",
};

type Tab = "overzicht" | "artikelen" | "notities" | "gesprekken";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProject, updateProject, addNoteToProject, deleteNote, deleteProject } = useProjects();
  const { conversations } = useChat();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>("overzicht");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [newNote, setNewNote] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const project = getProject(params.id as string);

  useEffect(() => {
    if (project) {
      setEditName(project.name);
      setEditDescription(project.description);
    }
  }, [project]);

  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-[#2c3e50] mb-2">
          Project niet gevonden
        </h2>
        <p className="text-[#8b97a5] mb-4">
          Dit project bestaat niet of is verwijderd.
        </p>
        <Link
          href="/projecten"
          className="inline-flex items-center gap-2 text-[#288978] hover:text-[#1e6b5c] font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar projecten
        </Link>
      </div>
    );
  }

  const projectArticles = articles.filter((article) =>
    project.articleIds.includes(article.id)
  );

  const projectConversations = conversations.filter(
    (conv) => conv.projectId === project.id
  );

  const handleSaveEdit = () => {
    if (!editName.trim()) return;
    updateProject(project.id, {
      name: editName.trim(),
      description: editDescription.trim(),
    });
    setIsEditing(false);
    success("Project bijgewerkt");
  };

  const handleStatusChange = (status: ProjectStatus) => {
    updateProject(project.id, { status });
    setShowStatusDropdown(false);
    success(`Status gewijzigd naar ${statusLabels[status]}`);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNoteToProject(project.id, newNote.trim());
    setNewNote("");
    success("Notitie toegevoegd");
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(project.id, noteId);
    success("Notitie verwijderd");
  };

  const handleDeleteProject = () => {
    deleteProject(project.id);
    success("Project verwijderd");
    router.push("/projecten");
  };

  const tabs: { id: Tab; label: string; icon: typeof FileText; count?: number }[] = [
    { id: "overzicht", label: "Overzicht", icon: FileText },
    { id: "artikelen", label: "Artikelen", icon: FileText, count: projectArticles.length },
    { id: "notities", label: "Notities", icon: StickyNote, count: project.notes.length },
    { id: "gesprekken", label: "Gesprekken", icon: MessageSquare, count: projectConversations.length },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/projecten"
          className="inline-flex items-center gap-2 text-sm text-[#8b97a5] hover:text-[#288978] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar projecten
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className="w-4 h-16 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <div>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-2xl font-bold text-[#2c3e50] bg-transparent border-b-2 border-[#288978] focus:outline-none"
                    autoFocus
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Beschrijving toevoegen..."
                    className="block w-full text-[#415161] bg-transparent border-b border-[#E2E7ED] focus:outline-none focus:border-[#288978] resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#288978] text-white rounded-lg text-sm font-medium"
                    >
                      <Save className="w-4 h-4" />
                      Opslaan
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditName(project.name);
                        setEditDescription(project.description);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-[#8b97a5] hover:text-[#2c3e50] text-sm"
                    >
                      Annuleren
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-[#2c3e50] mb-1">{project.name}</h1>
                  {project.description && (
                    <p className="text-[#415161] mb-3">{project.description}</p>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <button
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border ${statusColors[project.status]}`}
                      >
                        {statusLabels[project.status]}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showStatusDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-[#E2E7ED] rounded-xl shadow-lg z-10 py-1 min-w-[120px]">
                          {(Object.keys(statusLabels) as ProjectStatus[]).map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(status)}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f8f9fb] ${
                                project.status === status
                                  ? "text-[#288978] font-medium"
                                  : "text-[#2c3e50]"
                              }`}
                            >
                              {statusLabels[status]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-[#8b97a5]">
                      Aangemaakt:{" "}
                      {new Date(project.createdAt).toLocaleDateString("nl-NL")}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-[#415161] hover:text-[#288978] hover:bg-[#f8f9fb] rounded-xl transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Bewerken
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-[#E2E7ED]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-[#288978]"
                  : "text-[#8b97a5] hover:text-[#2c3e50]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md ${
                    activeTab === tab.id
                      ? "bg-[#288978]/10 text-[#288978]"
                      : "bg-[#f8f9fb] text-[#8b97a5]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#288978]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-[#E2E7ED] p-6">
        {/* Overview */}
        {activeTab === "overzicht" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-[#f8f9fb] rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-[#288978]" />
                <span className="font-semibold text-[#2c3e50]">
                  {projectArticles.length}
                </span>
              </div>
              <p className="text-sm text-[#8b97a5]">Opgeslagen artikelen</p>
            </div>
            <div className="p-4 bg-[#f8f9fb] rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <StickyNote className="w-5 h-5 text-[#288978]" />
                <span className="font-semibold text-[#2c3e50]">
                  {project.notes.length}
                </span>
              </div>
              <p className="text-sm text-[#8b97a5]">Notities</p>
            </div>
            <div className="p-4 bg-[#f8f9fb] rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-[#288978]" />
                <span className="font-semibold text-[#2c3e50]">
                  {projectConversations.length}
                </span>
              </div>
              <p className="text-sm text-[#8b97a5]">AI gesprekken</p>
            </div>
          </div>
        )}

        {/* Articles */}
        {activeTab === "artikelen" && (
          <div>
            {projectArticles.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-[#c5cdd6] mx-auto mb-3" />
                <p className="text-[#8b97a5] mb-4">
                  Nog geen artikelen opgeslagen in dit project
                </p>
                <Link
                  href="/bibliotheek"
                  className="inline-flex items-center gap-2 text-[#288978] hover:text-[#1e6b5c] font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Bladeren in bibliotheek
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projectArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/bibliotheek/${article.category}/${article.id}`}
                    className="flex items-center justify-between p-4 bg-[#f8f9fb] rounded-xl hover:bg-[#edeff2] transition-colors group"
                  >
                    <div>
                      <h4 className="font-medium text-[#2c3e50] group-hover:text-[#288978] transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-sm text-[#8b97a5] mt-1">
                        {article.summary}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#8b97a5] group-hover:text-[#288978]" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {activeTab === "notities" && (
          <div>
            {/* Add Note */}
            <div className="mb-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Schrijf een notitie..."
                rows={3}
                className="w-full px-4 py-3 bg-[#f8f9fb] border-2 border-[#E2E7ED] rounded-xl focus:outline-none focus:border-[#288978] resize-none text-[#2c3e50] placeholder:text-[#8b97a5]"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                    newNote.trim()
                      ? "bg-[#288978] text-white hover:bg-[#1e6b5c]"
                      : "bg-[#E2E7ED] text-[#8b97a5] cursor-not-allowed"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Toevoegen
                </button>
              </div>
            </div>

            {/* Notes List */}
            {project.notes.length === 0 ? (
              <div className="text-center py-8">
                <StickyNote className="w-12 h-12 text-[#c5cdd6] mx-auto mb-3" />
                <p className="text-[#8b97a5]">
                  Nog geen notities in dit project
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {project.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 bg-[#f8f9fb] rounded-xl group"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-[#2c3e50] whitespace-pre-wrap flex-1">
                        {note.content}
                      </p>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition-all ml-2"
                      >
                        <Trash2 className="w-4 h-4 text-[#8b97a5] hover:text-red-500" />
                      </button>
                    </div>
                    <p className="text-xs text-[#8b97a5] mt-2">
                      {new Date(note.createdAt).toLocaleDateString("nl-NL", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Conversations */}
        {activeTab === "gesprekken" && (
          <div>
            {projectConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-[#c5cdd6] mx-auto mb-3" />
                <p className="text-[#8b97a5] mb-4">
                  Nog geen gesprekken gekoppeld aan dit project
                </p>
                <Link
                  href="/assistent"
                  className="inline-flex items-center gap-2 text-[#288978] hover:text-[#1e6b5c] font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Start een gesprek
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projectConversations.map((conv) => (
                  <Link
                    key={conv.id}
                    href="/assistent"
                    className="flex items-center justify-between p-4 bg-[#f8f9fb] rounded-xl hover:bg-[#edeff2] transition-colors group"
                  >
                    <div>
                      <h4 className="font-medium text-[#2c3e50] group-hover:text-[#288978] transition-colors">
                        {conv.title}
                      </h4>
                      <p className="text-sm text-[#8b97a5] mt-1">
                        {conv.messages.length} berichten ·{" "}
                        {new Date(conv.updatedAt).toLocaleDateString("nl-NL")}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#8b97a5] group-hover:text-[#288978]" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl p-6">
            <h3 className="text-lg font-bold text-[#2c3e50] mb-2">
              Project verwijderen?
            </h3>
            <p className="text-[#415161] mb-6">
              Weet u zeker dat u &quot;{project.name}&quot; wilt verwijderen? Dit kan niet
              ongedaan worden gemaakt.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-[#415161] font-medium hover:bg-[#f8f9fb] rounded-xl transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
