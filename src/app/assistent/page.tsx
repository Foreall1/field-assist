"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  Sparkles,
  Plus,
  MessageSquare,
  FileText,
  Scale,
  ExternalLink,
  Briefcase,
  Trash2,
  FolderPlus,
  ChevronDown,
} from "lucide-react";
import { Avatar } from "@/components/ui";
import { useChat } from "@/contexts/ChatContext";
import { useUser } from "@/contexts/UserContext";
import { useProjects } from "@/contexts/ProjectContext";
import { useToast } from "@/contexts/ToastContext";
import { generateAIResponse } from "@/lib/ai-service";

export default function AssistentPage() {
  const { user } = useUser();
  const { projects } = useProjects();
  const { success } = useToast();
  const {
    conversations,
    currentConversation,
    createConversation,
    selectConversation,
    deleteConversation,
    addMessage,
  } = useChat();

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages, streamingContent]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleNewConversation = async () => {
    await createConversation(undefined, selectedProjectId || undefined);
    setSelectedProjectId(null);
  };

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteConversation(id);
    success("Gesprek verwijderd");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const query = inputValue.trim();
    setInputValue("");

    // Create conversation if none exists
    let conversationId = currentConversation?.id;
    if (!conversationId) {
      const newConv = await createConversation(undefined, selectedProjectId || undefined);
      if (!newConv) return;
      conversationId = newConv.id;
    }

    // Add user message
    await addMessage(conversationId, {
      role: "user",
      content: query,
    });

    setIsTyping(true);
    setStreamingContent("");

    try {
      // Generate AI response
      const response = await generateAIResponse(query, user?.role);

      // Add assistant message with response
      await addMessage(conversationId, {
        role: "assistant",
        content: response.content,
        citations: response.citations,
      });

    } catch (error) {
      console.error("Error generating response:", error);

      // Add error message
      await addMessage(conversationId, {
        role: "assistant",
        content: "Er is een fout opgetreden bij het genereren van een antwoord. Probeer het later opnieuw.",
      });
    } finally {
      setIsTyping(false);
      setStreamingContent("");
    }
  };

  const handleSuggestionClick = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Vandaag";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Gisteren";
    } else {
      return date.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "short",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "wet":
        return Scale;
      case "artikel":
        return FileText;
      default:
        return FileText;
    }
  };

  const suggestedQuestions = [
    "Wat zijn de belangrijkste wijzigingen onder de Omgevingswet?",
    "Hoe ga ik om met illegale bouw?",
    "Wat zijn de termijnen voor een vergunningaanvraag?",
    "Hoe werkt de bezwaarprocedure?",
  ];

  const messages = currentConversation?.messages || [];
  const displayMessages = streamingContent
    ? messages.map((m, i) =>
        i === messages.length - 1 && m.role === "assistant"
          ? { ...m, content: streamingContent }
          : m
      )
    : messages;

  return (
    <div className="flex h-[calc(100vh-130px)] -mx-8 -my-8">
      {/* Sidebar - Conversation History */}
      <aside className="w-80 bg-gradient-to-b from-[#f8f9fb] to-white border-r border-[#E2E7ED] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E7ED]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-[#2c3e50]">FIELD Assistent</h2>
              <p className="text-xs text-[#8b97a5]">AI-aangedreven hulp</p>
            </div>
          </div>

          {/* Project Selector */}
          {projects.length > 0 && (
            <div className="relative mb-3">
              <button
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#E2E7ED] rounded-lg text-sm hover:border-[#288978]/30 transition-colors"
              >
                <span className="flex items-center gap-2 text-[#415161]">
                  <FolderPlus className="w-4 h-4" />
                  {selectedProjectId
                    ? projects.find((p) => p.id === selectedProjectId)?.name
                    : "Kies een project (optioneel)"}
                </span>
                <ChevronDown className="w-4 h-4 text-[#8b97a5]" />
              </button>

              {showProjectDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E7ED] rounded-lg shadow-lg z-10 py-1">
                  <button
                    onClick={() => {
                      setSelectedProjectId(null);
                      setShowProjectDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-[#8b97a5] hover:bg-[#f8f9fb]"
                  >
                    Geen project
                  </button>
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setShowProjectDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-[#2c3e50] hover:bg-[#f8f9fb] flex items-center gap-2"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      {project.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#288978] text-white rounded-xl hover:bg-[#1e6b5c] transition-colors font-medium shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nieuw gesprek
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4">
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-10 h-10 text-[#c5cdd6] mx-auto mb-3" />
              <p className="text-sm text-[#8b97a5]">
                Nog geen gesprekken
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-xs font-semibold text-[#8b97a5] uppercase tracking-wide mb-3 px-2">
                Recente gesprekken
              </h3>
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                      conv.id === currentConversation?.id
                        ? "bg-white shadow-md border border-[#288978]/20"
                        : "hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          conv.id === currentConversation?.id
                            ? "bg-[#288978]/10"
                            : "bg-[#f8f9fb]"
                        }`}
                      >
                        <MessageSquare
                          className={`w-4 h-4 ${
                            conv.id === currentConversation?.id
                              ? "text-[#288978]"
                              : "text-[#8b97a5]"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            conv.id === currentConversation?.id
                              ? "text-[#288978]"
                              : "text-[#2c3e50]"
                          }`}
                        >
                          {conv.title}
                        </p>
                        <p className="text-xs text-[#8b97a5] mt-0.5">
                          {formatDate(conv.updatedAt)} · {conv.messages.length} berichten
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-[#8b97a5] hover:text-red-500" />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white">
        {/* Context Banner */}
        <div className="px-6 py-3 bg-gradient-to-r from-[#288978]/10 to-[#33a370]/10 border-b border-[#288978]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#288978]/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-[#288978]" />
            </div>
            <span className="text-sm text-[#2c3e50]">
              Context:{" "}
              <strong>
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "Vergunningverlener"}
              </strong>{" "}
              bij <strong>{user?.organization || "Uw organisatie"}</strong>
            </span>
          </div>
          <Link
            href="/dashboard/profiel"
            className="text-sm text-[#288978] hover:text-[#1e6b5c] font-medium"
          >
            Wijzigen
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {displayMessages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#2c3e50] mb-2">
                  Waarmee kan ik u helpen?
                </h2>
                <p className="text-[#415161] mb-6 max-w-md mx-auto">
                  Stel een vraag over vergunningverlening, handhaving, juridische
                  procedures of andere onderwerpen uit de kennisbank.
                </p>
              </div>
            ) : (
              displayMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center flex-shrink-0 shadow-md">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl ${
                      message.role === "user" ? "order-first" : ""
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-5 py-4 ${
                        message.role === "user"
                          ? "bg-[#288978] text-white rounded-tr-sm shadow-md"
                          : "bg-[#f8f9fb] text-[#2c3e50] rounded-tl-sm border border-[#E2E7ED]"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content.split("\n").map((line, i) => {
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return (
                              <strong key={i} className="block mt-3 mb-1">
                                {line.replace(/\*\*/g, "")}
                              </strong>
                            );
                          }
                          if (line.startsWith("- ")) {
                            return (
                              <li key={i} className="ml-4">
                                {line.substring(2)}
                              </li>
                            );
                          }
                          return (
                            <span key={i}>
                              {line}
                              {i < message.content.split("\n").length - 1 && <br />}
                            </span>
                          );
                        })}
                        {message.isStreaming && (
                          <span className="inline-block w-2 h-4 bg-[#288978] ml-1 animate-pulse" />
                        )}
                      </div>
                    </div>

                    {/* Citations */}
                    {message.citations && message.citations.length > 0 && !message.isStreaming && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-[#8b97a5] font-medium">
                          Bronnen:
                        </p>
                        {message.citations.map((citation) => {
                          const TypeIcon = getTypeIcon(citation.type);
                          return (
                            <Link
                              key={citation.id}
                              href={citation.url || "#"}
                              className="flex items-start gap-3 p-3 bg-white border border-[#E2E7ED] rounded-xl hover:border-[#288978]/30 hover:shadow-sm cursor-pointer transition-all duration-200"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#288978]/10 flex items-center justify-center flex-shrink-0">
                                <TypeIcon className="w-4 h-4 text-[#288978]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#2c3e50]">
                                  {citation.title}
                                </p>
                                <p className="text-xs text-[#8b97a5] truncate">
                                  {citation.excerpt}
                                </p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-[#c5cdd6]" />
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {/* Timestamp */}
                    <p
                      className={`text-xs mt-2 ${
                        message.role === "user"
                          ? "text-right text-[#8b97a5]"
                          : "text-[#8b97a5]"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <Avatar name={user?.name || "Gebruiker"} size="md" />
                  )}
                </div>
              ))
            )}

            {/* Typing Indicator */}
            {isTyping && !streamingContent && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="bg-[#f8f9fb] border border-[#E2E7ED] rounded-2xl rounded-tl-sm px-5 py-4">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-[#288978] rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-[#288978] rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 bg-[#288978] rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested Questions */}
        {displayMessages.length === 0 && (
          <div className="px-6 pb-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs text-[#8b97a5] mb-2 font-medium">
                Suggesties:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="px-4 py-2 bg-[#f8f9fb] hover:bg-[#288978]/10 text-sm text-[#2c3e50] hover:text-[#288978] rounded-xl border border-[#E2E7ED] hover:border-[#288978]/30 transition-all duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-[#E2E7ED] bg-[#f8f9fb]">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-3">
              <div className="flex-1 relative group">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#288978] to-[#33a370] rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300 -z-10"
                  style={{ margin: "-2px" }}
                />
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Stel uw vraag..."
                  rows={1}
                  className="w-full px-5 py-3.5 bg-white border-2 border-[#E2E7ED] rounded-xl focus:outline-none focus:border-[#288978] resize-none text-[#2c3e50] placeholder:text-[#8b97a5] transition-all duration-200"
                  style={{ minHeight: "52px", maxHeight: "120px" }}
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-3.5 bg-[#288978] text-white rounded-xl hover:bg-[#1e6b5c] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#8b97a5] mt-3 text-center">
              FIELD Assist kan fouten maken. Controleer belangrijke informatie.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
