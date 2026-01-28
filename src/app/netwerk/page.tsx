"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Send,
  User,
  Building2,
  FileText,
  Users,
  Loader2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  netwerkStats,
  netwerkAIResponses,
  findAIResponse,
  defaultAIResponse,
  gemeenten,
} from "@/lib/data";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  bronnen?: { type: string; titel: string; extra?: string }[];
}

export default function NetwerkAIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const response = findAIResponse(text, netwerkAIResponses) || defaultAIResponse;

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response.antwoord,
      bronnen: response.bronnen,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const suggestedQuestions = [
    {
      icon: Building2,
      title: "Short-stay beleid",
      description: "Vergelijk aanpak vakantieverhuur",
      question: "Hoe gaan gemeenten om met short-stay vergunningen?",
    },
    {
      icon: FileText,
      title: "Handhaving best practices",
      description: "Leer van andere gemeenten",
      question: "Wat zijn best practices voor handhaving?",
    },
    {
      icon: Users,
      title: "Welstandsprocedures",
      description: "Termijnen en werkwijzen",
      question: "Vergelijk welstandsprocedures tussen gemeenten",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e8ecf0] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="w-10 h-10 rounded-xl bg-[#f4f6f8] hover:bg-[#e8ecf0] flex items-center justify-center text-[#7a8a9a] hover:text-[#1a2e3b] transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center shadow-lg shadow-[#288978]/25">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-[#1a2e3b]">Netwerk AI</h1>
                  <p className="text-sm text-[#7a8a9a]">
                    Vergelijk {netwerkStats.totaalGemeenten} gemeenten
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
              {gemeenten.slice(0, 4).map((gemeente) => (
                <div
                  key={gemeente.id}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  style={{ backgroundColor: gemeente.color }}
                  title={gemeente.naam}
                >
                  {gemeente.naam.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center shadow-2xl shadow-[#288978]/30 animate-fade-in">
                  <Globe className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center border border-[#e8ecf0]">
                  <Sparkles className="w-5 h-5 text-[#288978]" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#1a2e3b] mb-3 animate-fade-in-up">
                Vergelijk best practices
              </h2>
              <p className="text-[#7a8a9a] max-w-md mb-10 leading-relaxed animate-fade-in-up delay-100">
                Stel vragen over hoe verschillende gemeenten werken.
                Ontdek best practices en leer van het hele netwerk.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-8 mb-12 animate-fade-in-up delay-150">
                {[
                  { icon: Building2, label: "Gemeenten", value: netwerkStats.totaalGemeenten },
                  { icon: FileText, label: "Documenten", value: netwerkStats.totaalDocumenten },
                  { icon: Users, label: "Fielders", value: netwerkStats.actieveFielders },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-[#288978]/10 flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="w-6 h-6 text-[#288978]" />
                    </div>
                    <p className="text-xl font-bold text-[#1a2e3b]">{stat.value}</p>
                    <p className="text-xs text-[#7a8a9a]">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Suggested Questions */}
              <div className="w-full max-w-2xl animate-fade-in-up delay-200">
                <p className="text-sm text-[#7a8a9a] mb-4">Probeer een vraag:</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {suggestedQuestions.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => handleSendMessage(item.question)}
                      className="text-left p-5 bg-white rounded-2xl border border-[#e8ecf0] hover:border-[#288978] hover:shadow-lg transition-all group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[#288978]/10 flex items-center justify-center mb-3 group-hover:bg-[#288978] group-hover:shadow-lg group-hover:shadow-[#288978]/25 transition-all">
                        <item.icon className="w-5 h-5 text-[#288978] group-hover:text-white transition-colors" />
                      </div>
                      <p className="font-semibold text-[#1a2e3b] mb-1 group-hover:text-[#288978] transition-colors">
                        {item.title}
                      </p>
                      <p className="text-sm text-[#7a8a9a]">
                        {item.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""} animate-fade-in-up`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center shadow-md">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-[#288978] to-[#33a370] text-white rounded-2xl rounded-br-md px-5 py-3 shadow-lg shadow-[#288978]/20"
                        : "bg-white rounded-2xl rounded-tl-md px-6 py-5 border border-[#e8ecf0] shadow-sm"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <>
                        <div className="prose-field">
                          {message.content.split("\n\n").map((paragraph, i) => (
                            <p
                              key={i}
                              className="mb-3 last:mb-0 leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: paragraph
                                  .replace(/\*\*(.*?)\*\*/g, "<strong class='text-[#1a2e3b]'>$1</strong>")
                                  .replace(/\n/g, "<br />"),
                              }}
                            />
                          ))}
                        </div>

                        {message.bronnen && message.bronnen.length > 0 && (
                          <div className="mt-5 pt-4 border-t border-[#e8ecf0]">
                            <p className="text-xs font-semibold text-[#7a8a9a] uppercase tracking-wide mb-3">
                              Bronnen uit het netwerk
                            </p>
                            <div className="space-y-2">
                              {message.bronnen.map((bron, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 p-3 bg-[#f4f6f8] rounded-xl hover:bg-[#e8ecf0] transition-colors cursor-pointer"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-[#288978]/10 flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-4 h-4 text-[#288978]" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#1a2e3b] truncate">
                                      {bron.titel}
                                    </p>
                                    {bron.extra && (
                                      <p className="text-xs text-[#7a8a9a]">
                                        {bron.extra}
                                      </p>
                                    )}
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-[#a8b5c4]" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="leading-relaxed">{message.content}</p>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#f4f6f8] flex items-center justify-center">
                      <User className="w-5 h-5 text-[#7a8a9a]" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4 animate-fade-in">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center shadow-md">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-md px-6 py-5 border border-[#e8ecf0] shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-[#288978] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-[#288978] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-[#288978] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-[#7a8a9a]">
                        Doorzoekt {netwerkStats.totaalGemeenten} gemeenten...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-[#e8ecf0] bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Vergelijk best practices tussen gemeenten..."
              disabled={isLoading}
              className="w-full px-6 py-4 pr-16 bg-[#f4f6f8] border border-[#e8ecf0] rounded-xl focus:outline-none focus:border-[#288978] focus:bg-white transition-all text-[#1a2e3b] placeholder:text-[#a8b5c4] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#288978] to-[#33a370] text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#288978]/30 transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
