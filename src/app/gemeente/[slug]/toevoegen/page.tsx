"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  FileText,
  Lightbulb,
  UserCircle,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  BookOpen,
  Upload,
  X,
  File,
} from "lucide-react";
import { getGemeente } from "@/lib/data";
import { useUser } from "@/contexts/UserContext";
import { getSupabaseClient } from "@/lib/supabase";

type ContentType = "proces" | "template" | "tip" | "contact" | "handboek";

const contentTypes = [
  {
    id: "proces" as ContentType,
    label: "Proces",
    description: "Stap-voor-stap werkproces",
    icon: ClipboardList,
    color: "#288978",
  },
  {
    id: "template" as ContentType,
    label: "Template",
    description: "Document template met bestand",
    icon: FileText,
    color: "#33a370",
  },
  {
    id: "handboek" as ContentType,
    label: "Handboek",
    description: "PDF handboek of handleiding",
    icon: BookOpen,
    color: "#2dd4bf",
  },
  {
    id: "tip" as ContentType,
    label: "Tip",
    description: "Praktische tip voor collega's",
    icon: Lightbulb,
    color: "#f59e0b",
  },
  {
    id: "contact" as ContentType,
    label: "Contact",
    description: "Nuttig contactpersoon",
    icon: UserCircle,
    color: "#0ea5e9",
  },
];

export default function ToevoegenPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const gemeenteId = params.slug as string;
  const gemeente = getGemeente(gemeenteId);
  const { user } = useUser();
  const supabase = getSupabaseClient();

  const [selectedType, setSelectedType] = useState<ContentType | null>(null);

  // Pre-select type from URL parameter
  useEffect(() => {
    const typeParam = searchParams.get('type') as ContentType | null;
    if (typeParam && contentTypes.some(t => t.id === typeParam)) {
      setSelectedType(typeParam);
    }
  }, [searchParams]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Process form state
  const [procesTitel, setProcesTitel] = useState("");
  const [procesBeschrijving, setProcesBeschrijving] = useState("");
  const [procesStappen, setProcesStappen] = useState<string[]>([""]);

  // Template form state
  const [templateTitel, setTemplateTitel] = useState("");
  const [templateBeschrijving, setTemplateBeschrijving] = useState("");
  const [templateTip, setTemplateTip] = useState("");
  const [templateType, setTemplateType] = useState("DOCX");
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const templateFileRef = useRef<HTMLInputElement>(null);

  // Handboek form state
  const [handboekTitel, setHandboekTitel] = useState("");
  const [handboekBeschrijving, setHandboekBeschrijving] = useState("");
  const [handboekFile, setHandboekFile] = useState<File | null>(null);
  const handboekFileRef = useRef<HTMLInputElement>(null);

  // Tip form state
  const [tipTekst, setTipTekst] = useState("");

  // Upload state
  const [uploadProgress, setUploadProgress] = useState(0);

  // Contact form state
  const [contactNaam, setContactNaam] = useState("");
  const [contactFunctie, setContactFunctie] = useState("");
  const [contactTelefoon, setContactTelefoon] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactWanneer, setContactWanneer] = useState("");

  if (!gemeente) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Gemeente niet gevonden</p>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-[#288978]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserCircle className="w-8 h-8 text-[#288978]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a2e3b] mb-3">
            Login vereist
          </h1>
          <p className="text-[#7a8a9a] mb-6">
            Je moet ingelogd zijn om kennis toe te voegen aan {gemeente.naam}.
          </p>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="flex-1 bg-[#288978] hover:bg-[#1e6b5c] text-white font-medium py-3 px-4 rounded-xl transition-colors text-center"
            >
              Inloggen
            </Link>
            <Link
              href="/register"
              className="flex-1 border-2 border-[#288978] text-[#288978] font-medium py-3 px-4 rounded-xl hover:bg-[#288978]/5 transition-colors text-center"
            >
              Registreren
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const addStap = () => {
    setProcesStappen([...procesStappen, ""]);
  };

  const removeStap = (index: number) => {
    if (procesStappen.length > 1) {
      setProcesStappen(procesStappen.filter((_, i) => i !== index));
    }
  };

  const updateStap = (index: number, value: string) => {
    const newStappen = [...procesStappen];
    newStappen[index] = value;
    setProcesStappen(newStappen);
  };

  // File upload functie
  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${user.id}/${fileName}`;

      setUploadProgress(10);

      const { error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      setUploadProgress(80);

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      return urlData.publicUrl;
    } catch (err) {
      console.error('Error uploading file:', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (selectedType === "proces") {
        const { error: insertError } = await supabase.from("processen").insert({
          gemeente_id: gemeenteId,
          titel: procesTitel,
          beschrijving: procesBeschrijving,
          stappen: procesStappen.filter((s) => s.trim()),
          auteur_id: user.id,
          auteur_naam: user.name,
          vakgroep: "VTH",
        });
        if (insertError) throw insertError;
      } else if (selectedType === "template") {
        let fileUrl = null;
        if (templateFile) {
          fileUrl = await uploadFile(templateFile, 'templates');
          if (!fileUrl) {
            throw new Error('Bestand uploaden mislukt');
          }
        }

        const { error: insertError } = await supabase.from("templates").insert({
          gemeente_id: gemeenteId,
          titel: templateTitel,
          beschrijving: templateBeschrijving,
          bestandstype: templateType,
          tip: templateTip || null,
          auteur_id: user.id,
          auteur_naam: user.name,
          vakgroep: "VTH",
          file_url: fileUrl,
        });
        if (insertError) throw insertError;
      } else if (selectedType === "handboek") {
        if (!handboekFile) {
          throw new Error('Selecteer een PDF bestand');
        }

        const fileUrl = await uploadFile(handboekFile, 'handboeken');
        if (!fileUrl) {
          throw new Error('Bestand uploaden mislukt');
        }

        // Count pages (approximate based on file size for now)
        const approxPages = Math.ceil(handboekFile.size / 50000);

        const { error: insertError } = await supabase.from("handboeken").insert({
          gemeente_id: gemeenteId,
          titel: handboekTitel,
          beschrijving: handboekBeschrijving,
          paginas: approxPages,
          auteur_id: user.id,
          auteur_naam: user.name,
          file_url: fileUrl,
        });
        if (insertError) throw insertError;
      } else if (selectedType === "tip") {
        const { error: insertError } = await supabase.from("tips").insert({
          gemeente_id: gemeenteId,
          tekst: tipTekst,
          auteur_id: user.id,
          auteur_naam: user.name,
        });
        if (insertError) throw insertError;
      } else if (selectedType === "contact") {
        const { error: insertError } = await supabase.from("contacten").insert({
          gemeente_id: gemeenteId,
          naam: contactNaam,
          functie: contactFunctie,
          telefoon: contactTelefoon,
          email: contactEmail,
          wanneer_benaderen: contactWanneer,
          toegevoegd_door_id: user.id,
          toegevoegd_door_naam: user.name,
        });
        if (insertError) throw insertError;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/gemeente/${gemeenteId}`);
      }, 2000);
    } catch (err) {
      console.error("Error submitting:", err);
      setError("Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a2e3b] mb-3">
            Succesvol toegevoegd!
          </h1>
          <p className="text-[#7a8a9a]">
            Je bijdrage is toegevoegd aan {gemeente.naam}. Bedankt voor het
            delen van je kennis!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Header */}
      <div className="bg-white border-b border-[#e8ecf0]">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link
            href={`/gemeente/${gemeenteId}`}
            className="inline-flex items-center gap-2 text-sm text-[#7a8a9a] hover:text-[#288978] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar {gemeente.naam}
          </Link>

          <h1 className="text-2xl font-bold text-[#1a2e3b]">
            Kennis toevoegen aan {gemeente.naam}
          </h1>
          <p className="text-[#7a8a9a] mt-1">
            Deel je kennis met collega&apos;s binnen {gemeente.naam}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {!selectedType ? (
          // Type Selection
          <div>
            <h2 className="font-semibold text-[#1a2e3b] mb-4">
              Wat wil je toevoegen?
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className="bg-white rounded-xl border border-[#e8ecf0] p-6 text-left hover:border-[#288978]/30 hover:shadow-md transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${type.color}15` }}
                  >
                    <type.icon
                      className="w-6 h-6"
                      style={{ color: type.color }}
                    />
                  </div>
                  <h3 className="font-semibold text-[#1a2e3b] mb-1 group-hover:text-[#288978]">
                    {type.label}
                  </h3>
                  <p className="text-sm text-[#7a8a9a]">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Content Form
          <div className="bg-white rounded-xl border border-[#e8ecf0] p-6">
            <button
              onClick={() => setSelectedType(null)}
              className="inline-flex items-center gap-2 text-sm text-[#7a8a9a] hover:text-[#288978] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar type selectie
            </button>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Process Form */}
              {selectedType === "proces" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                      Titel van het proces
                    </label>
                    <input
                      type="text"
                      value={procesTitel}
                      onChange={(e) => setProcesTitel(e.target.value)}
                      placeholder="bijv. Omgevingsvergunning aanvragen"
                      className="w-full px-4 py-3 border border-[#e8ecf0] rounded-xl focus:ring-2 focus:ring-[#288978] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                      Korte beschrijving
                    </label>
                    <textarea
                      value={procesBeschrijving}
                      onChange={(e) => setProcesBeschrijving(e.target.value)}
                      placeholder="Beschrijf kort waar dit proces over gaat"
                      rows={2}
                      className="w-full px-4 py-3 border border-[#e8ecf0] rounded-xl focus:ring-2 focus:ring-[#288978] focus:border-transparent resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                      Stappen
                    </label>
                    <div className="space-y-3">
                      {procesStappen.map((stap, index) => (
                        <div key={index} className="flex gap-2">
                          <span className="w-8 h-10 flex items-center justify-center text-sm font-medium text-[#7a8a9a]">
                            {index + 1}.
                          </span>
                          <input
                            type="text"
                            value={stap}
                            onChange={(e) => updateStap(index, e.target.value)}
                            placeholder={`Stap ${index + 1}`}
                            className="flex-1 px-4 py-2 border border-[#e8ecf0] rounded-lg focus:ring-2 focus:ring-[#288978] focus:border-transparent"
                          />
                          {procesStappen.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStap(index)}
                              className="p-2 text-[#a8b5c4] hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addStap}
                      className="mt-3 inline-flex items-center gap-2 text-sm text-[#288978] hover:text-[#1e6b5c] font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Stap toevoegen
                    </button>
                  </div>
                </>
              )}

              {/* Template Form */}
              {selectedType === "template" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                      Naam van de template
                    </label>
                    <input
                      type="text"
                      value={templateTitel}
                      onChange={(e) => setTemplateTitel(e.target.value)}
                      placeholder="bijv. Besluit omgevingsvergunning"
                      className="w-full px-4 py-3 border border-[#e8ecf0] rounded-xl focus:ring-2 focus:ring-[#288978] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                      Beschrijving
                    </label>
                    <textarea
                      value={templateBeschrijving}
                      onChange={(e) => setTemplateBeschrijving(e.target.value)}
                      placeholder="Beschrijf waarvoor deze template gebruikt wordt"
                      rows={2}
                      className="w-full px-4 py-3 border border-[#e8ecf0] rounded-xl focus:ring-2 focus:ring-[#288978] focus:border-transparent resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                      Bestandstype
                    </label>
                    <select
                      value={templateType}
                      onChange={(e) => setTemplateType(e.target.value)}
                      className="w-full px-4 py-3 border border-[#e8ecf0] rounded-xl focus:ring-2 focus:ring-[#288978] focus:border-transparent"
                    >
                      <option value="DOCX">Word document (.docx)</option>
                      <option value="XLSX">Excel (.xlsx)</option>
                      <option value="PDF">PDF document</option>
                    </select>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                      Bestand uploaden
                    </label>
                    <input
                      type="file"
                      ref={templateFileRef}
                      onChange={(e) => setTemplateFile(e.target.files?.[0] || null)}
                      accept=".docx,.xlsx,.pdf,.doc,.xls"
                      className="hidden"
                    />
                    {templateFile ? (
                      <div className="flex items-center gap-3 p-4 bg-[#288978]/5 border border-[#288978]/20 rounded-xl">
                        <File className="w-8 h-8 text-[#288978]" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#1a2e3b] truncate">{templateFile.name}</p>
                          <p className="text-sm text-[#7a8a9a]">
                            {(templateFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setTemplateFile(null);
                            if (templateFileRef.current) templateFileRef.current.value = '';
                          }}
                          className="p-2 text-[#7a8a9a] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => templateFileRef.current?.click()}
                        className="w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-[#e8ecf0] rounded-xl hover:border-[#288978]/50 hover:bg-[#288978]/5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-[#7a8a9a]" />
                        <span className="text-sm text-[#7a8a9a]">
                          Klik om een bestand te selecteren
                        </span>
                        <span className="text-xs text-[#a8b5c4]">
                          .docx, .xlsx, .pdf (max 10MB)
                        </span>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                      Tip voor gebruik (optioneel)
                    </label>
                    <input
                      type="text"
                      value={templateTip}
                      onChange={(e) => setTemplateTip(e.target.value)}
                      placeholder="bijv. Vergeet niet de datum aan te passen"
                      className="w-full px-4 py-3 border border-[#e8ecf0] rounded-xl focus:ring-2 focus:ring-[#288978] focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Handboek Form */}
              {selectedType === "handboek" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                      Titel van het handboek
                    </label>
                    <input
                      type="text"
                      value={handboekTitel}
                      onChange={(e) => setHandboekTitel(e.target.value)}
                      placeholder="bijv. VTH Handboek 2024"
                      className="w-full px-4 py-3 border border-[#e8ecf0] rounded-xl focus:ring-2 focus:ring-[#288978] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                      Beschrijving
                    </label>
                    <textarea
                      value={handboekBeschrijving}
                      onChange={(e) => setHandboekBeschrijving(e.target.value)}
                      placeholder="Beschrijf de inhoud van dit handboek"
                      rows={3}
                      className="w-full px-4 py-3 border border-[#e8ecf0] rounded-xl focus:ring-2 focus:ring-[#288978] focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  {/* PDF Upload */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                      PDF uploaden *
                    </label>
                    <input
                      type="file"
                      ref={handboekFileRef}
                      onChange={(e) => setHandboekFile(e.target.files?.[0] || null)}
                      accept=".pdf"
                      className="hidden"
                    />
                    {handboekFile ? (
                      <div className="flex items-center gap-3 p-4 bg-[#2dd4bf]/5 border border-[#2dd4bf]/20 rounded-xl">
                        <BookOpen className="w-8 h-8 text-[#2dd4bf]" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#1a2e3b] truncate">{handboekFile.name}</p>
                          <p className="text-sm text-[#7a8a9a]">
                            {(handboekFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setHandboekFile(null);
                            if (handboekFileRef.current) handboekFileRef.current.value = '';
                          }}
                          className="p-2 text-[#7a8a9a] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handboekFileRef.current?.click()}
                        className="w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-[#e8ecf0] rounded-xl hover:border-[#2dd4bf]/50 hover:bg-[#2dd4bf]/5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-[#7a8a9a]" />
                        <span className="text-sm text-[#7a8a9a]">
                          Klik om een PDF te selecteren
                        </span>
                        <span className="text-xs text-[#a8b5c4]">
                          Alleen .pdf bestanden (max 50MB)
                        </span>
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Tip Form */}
              {selectedType === "tip" && (
                <div>
                  <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                    Jouw tip
                  </label>
                  <textarea
                    value={tipTekst}
                    onChange={(e) => setTipTekst(e.target.value)}
                    placeholder="Deel een praktische tip met je collega's..."
                    rows={4}
                    className="w-full px-4 py-3 border border-[#e8ecf0] rounded-xl focus:ring-2 focus:ring-[#288978] focus:border-transparent resize-none"
                    required
                  />
                  <p className="mt-2 text-sm text-[#7a8a9a]">
                    Goede tips zijn specifiek, praktisch en helpen collega&apos;s
                    bij hun dagelijkse werk.
                  </p>
                </div>
              )}

              {/* Contact Form */}
              {selectedType === "contact" && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                        Naam
                      </label>
                      <input
                        type="text"
                        value={contactNaam}
                        onChange={(e) => setContactNaam(e.target.value)}
                        placeholder="Jan Janssen"
                        className="w-full px-4 py-3 border border-[#e8ecf0] rounded-xl focus:ring-2 focus:ring-[#288978] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                        Functie
                      </label>
                      <input
                        type="text"
                        value={contactFunctie}
                        onChange={(e) => setContactFunctie(e.target.value)}
                        placeholder="Teamleider Vergunningen"
                        className="w-full px-4 py-3 border border-[#e8ecf0] rounded-xl focus:ring-2 focus:ring-[#288978] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                        Telefoonnummer
                      </label>
                      <input
                        type="tel"
                        value={contactTelefoon}
                        onChange={(e) => setContactTelefoon(e.target.value)}
                        placeholder="06-12345678"
                        className="w-full px-4 py-3 border border-[#e8ecf0] rounded-xl focus:ring-2 focus:ring-[#288978] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                        E-mailadres
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="j.janssen@gemeente.nl"
                        className="w-full px-4 py-3 border border-[#e8ecf0] rounded-xl focus:ring-2 focus:ring-[#288978] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a2e3b] mb-2">
                      Wanneer benaderen
                    </label>
                    <input
                      type="text"
                      value={contactWanneer}
                      onChange={(e) => setContactWanneer(e.target.value)}
                      placeholder="bijv. Bij complexe vergunningsaanvragen"
                      className="w-full px-4 py-3 border border-[#e8ecf0] rounded-xl focus:ring-2 focus:ring-[#288978] focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-4 border-t border-[#e8ecf0]">
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-[#7a8a9a] mb-1">
                      <span>Uploaden...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#e8ecf0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#288978] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#288978] hover:bg-[#1e6b5c] text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {uploadProgress > 0 ? 'Bestand uploaden...' : 'Bezig met opslaan...'}
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Toevoegen
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
