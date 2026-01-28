"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Send,
  FileText,
  User,
  Scale,
  Loader2,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import {
  getGemeente,
  getGemeenteContent,
  rotterdamAIResponses,
  amsterdamAIResponses,
  findAIResponse,
  defaultAIResponse,
} from "@/lib/data";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  bronnen?: { type: string; titel: string; extra?: string }[];
}

export default function GemeenteAIPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gemeenteId = params.slug as string;
  const initialVraag = searchParams.get("vraag");

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const gemeente = getGemeente(gemeenteId);
  const content = getGemeenteContent(gemeenteId);

  const aiResponses =
    gemeenteId === "rotterdam"
      ? rotterdamAIResponses
      : gemeenteId === "amsterdam"
      ? amsterdamAIResponses
      : [];

  useEffect(() => {
    if (initialVraag && messages.length === 0) {
      handleSendMessage(initialVraag);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialVraag]);

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

    const response = findAIResponse(text, aiResponses) || defaultAIResponse;

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

  if (!gemeente || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#f4f6f8] flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-[#a8b5c4]" />
          </div>
          <p className="text-[#7a8a9a]">Gemeente niet gevonden</p>
        </div>
      </div>
    );
  }

  const suggestedQuestions = [
    { title: "Welstandsadvies", description: "Procedure en termijnen", question: "Hoe vraag ik een welstandsadvies aan?" },
    { title: "Vergunningprocedure", description: "Stappen en doorlooptijd", question: "Wat is de vergunningprocedure?" },
    { title: "Handhaving", description: "Proces en templates", question: "Hoe start ik een handhavingstraject?" },
    { title: "Contacten", description: "Wie benader ik?", question: "Wie moet ik benaderen voor juridische vragen?" },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e8ecf0] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/gemeente/${gemeenteId}`}
                className="w-10 h-10 rounded-xl bg-[#f4f6f8] hover:bg-[#e8ecf0] flex items-center justify-center text-[#7a8a9a] hover:text-[#1a2e3b] transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-lg"
                  style={{
                    backgroundColor: gemeente.color,
                    boxShadow: `0 8px 16px ${gemeente.color}40`
                  }}
                >
                  {gemeente.naam.charAt(0)}
                </div>
                <div>
                  <h1 className="font-bold text-[#1a2e3b]">{gemeente.naam} AI</h1>
                  <p className="text-sm text-[#7a8a9a]">
                    Zoekt in alle {gemeente.naam} kennis
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm text-[#7a8a9a]">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f6f8] rounded-lg">
                <FileText className="w-3.5 h-3.5 text-[#288978]" />
                {content.processen.length + content.templates.length} docs
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f6f8] rounded-lg">
                <Scale className="w-3.5 h-3.5 text-[#288978]" />
                Beleid
              </span>
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
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl animate-fade-in"
                  style={{
                    backgroundColor: gemeente.color,
                    boxShadow: `0 20px 40px ${gemeente.color}40`
                  }}
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#1a2e3b] mb-3 animate-fade-in-up">
                {gemeente.naam} AI
              </h2>
              <p className="text-[#7a8a9a] max-w-md mb-10 leading-relaxed animate-fade-in-up delay-100">
                Stel vragen over processen, templates en werkwijzen bij {gemeente.naam}.
                Ik zoek in alle beschikbare FIELD kennis.
              </p>

              {/* Suggested Questions */}
              <div className="w-full max-w-lg animate-fade-in-up delay-200">
                <p className="text-sm text-[#7a8a9a] mb-4">Probeer een vraag:</p>
                <div className="grid grid-cols-2 gap-3">
                  {suggestedQuestions.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => handleSendMessage(item.question)}
                      className="text-left p-4 bg-white rounded-xl border border-[#e8ecf0] hover:border-[#288978] hover:shadow-lg transition-all group"
                    >
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
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                      style={{ backgroundColor: gemeente.color }}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] ${
                      message.role === "user"
                        ? "text-white rounded-2xl rounded-br-md px-5 py-3 shadow-lg"
                        : "bg-white rounded-2xl rounded-tl-md px-6 py-5 border border-[#e8ecf0] shadow-sm"
                    }`}
                    style={message.role === "user" ? {
                      background: `linear-gradient(135deg, ${gemeente.color} 0%, ${gemeente.color}dd 100%)`,
                      boxShadow: `0 8px 20px ${gemeente.color}30`
                    } : {}}
                  >
                    {message.role === "assistant" ? (
                      <>
                        <div className="prose-field">
                          {message.content.split("\n\n").map((paragraph, i) => (
                            <p
                              key={i}
                              className="mb-3 last:mb-0 leading-relaxed text-[#415161]"
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
                              Bronnen
                            </p>
                            <div className="space-y-2">
                              {message.bronnen.map((bron, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 p-3 bg-[#f4f6f8] rounded-xl hover:bg-[#e8ecf0] transition-colors cursor-pointer"
                                >
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: `${gemeente.color}15` }}
                                  >
                                    <FileText className="w-4 h-4" style={{ color: gemeente.color }} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#1a2e3b] truncate">
                                      {bron.titel}
                                    </p>
                                    <p className="text-xs text-[#7a8a9a]">
                                      {bron.type} {bron.extra && `• ${bron.extra}`}
                                    </p>
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
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: gemeente.color }}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-md px-6 py-5 border border-[#e8ecf0] shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: gemeente.color, animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: gemeente.color, animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: gemeente.color, animationDelay: "300ms" }} />
                      </div>
                      <span className="text-[#7a8a9a]">
                        Zoeken in {gemeente.naam} kennis...
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
              placeholder={`Stel een vraag over ${gemeente.naam}...`}
              disabled={isLoading}
              className="w-full px-6 py-4 pr-16 bg-[#f4f6f8] border border-[#e8ecf0] rounded-xl focus:outline-none focus:border-[#288978] focus:bg-white transition-all text-[#1a2e3b] placeholder:text-[#a8b5c4] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${gemeente.color} 0%, ${gemeente.color}dd 100%)`,
                boxShadow: `0 4px 12px ${gemeente.color}40`
              }}
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
