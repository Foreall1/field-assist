"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Building2,
  Briefcase,
  Sparkles,
  FileCheck,
  Shield,
  Scale,
  Map,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/contexts/ToastContext";
import { UserRole } from "@/lib/types";

const steps = [
  { id: 1, title: "Welkom", description: "Laten we beginnen" },
  { id: 2, title: "Persoonlijk", description: "Uw gegevens" },
  { id: 3, title: "Functie", description: "Uw rol" },
  { id: 4, title: "Interesses", description: "Uw focus" },
];

const roles: { id: UserRole; name: string; description: string; icon: typeof FileCheck }[] = [
  {
    id: "vergunningverlener",
    name: "Vergunningverlener",
    description: "U behandelt aanvragen voor omgevingsvergunningen",
    icon: FileCheck,
  },
  {
    id: "toezichthouder",
    name: "Toezichthouder",
    description: "U houdt toezicht op naleving van regels en vergunningen",
    icon: Shield,
  },
  {
    id: "jurist",
    name: "Jurist",
    description: "U behandelt bezwaren, beroepen en juridische vraagstukken",
    icon: Scale,
  },
  {
    id: "beleidsmedewerker",
    name: "Beleidsmedewerker",
    description: "U werkt aan beleid en regelgeving",
    icon: Map,
  },
];

const interests = [
  { id: "omgevingswet", label: "Omgevingswet", category: "Wetgeving" },
  { id: "vergunningen", label: "Vergunningprocedures", category: "Procedures" },
  { id: "handhaving", label: "Handhaving", category: "Toezicht" },
  { id: "bezwaar", label: "Bezwaar & Beroep", category: "Juridisch" },
  { id: "ruimtelijk", label: "Ruimtelijke Ordening", category: "Beleid" },
  { id: "milieu", label: "Milieu & Duurzaamheid", category: "Thema" },
  { id: "bouwen", label: "Bouwen & Wonen", category: "Thema" },
  { id: "jurisprudentie", label: "Jurisprudentie", category: "Juridisch" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { login, completeOnboarding } = useUser();
  const { success } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    role: "" as UserRole | "",
    interests: [] as string[],
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (!formData.name || !formData.role) return;

    login({
      name: formData.name,
      organization: formData.organization,
      role: formData.role as UserRole,
      specializations: formData.interests,
    });

    completeOnboarding();
    success("Welkom bij FIELD Assist!", "Uw profiel is aangemaakt.");
    router.push("/");
  };

  const toggleInterest = (interestId: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((i) => i !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return formData.name.trim().length > 0;
      case 3:
        return formData.role !== "";
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fb] via-white to-[#edeff2] flex items-center justify-center p-8 -m-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#288978]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-[#33a370]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep > step.id
                      ? "bg-[#288978] text-white"
                      : currentStep === step.id
                      ? "bg-[#288978] text-white shadow-lg shadow-[#288978]/30"
                      : "bg-[#E2E7ED] text-[#8b97a5]"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    currentStep >= step.id ? "text-[#2c3e50]" : "text-[#8b97a5]"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-2 rounded-full transition-colors duration-300 ${
                    currentStep > step.id ? "bg-[#288978]" : "bg-[#E2E7ED]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#E2E7ED] overflow-hidden">
          {/* Step Content */}
          <div className="p-8 md:p-12">
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#288978] to-[#33a370] flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-[#2c3e50] mb-4">
                  Welkom bij FIELD Assist
                </h1>
                <p className="text-[#415161] text-lg mb-8 max-w-md mx-auto">
                  Uw persoonlijke kennisassistent voor vergunningverlening,
                  handhaving en juridische vraagstukken.
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                  <div className="p-4 bg-[#f8f9fb] rounded-xl">
                    <BookOpen className="w-6 h-6 text-[#288978] mx-auto mb-2" />
                    <p className="text-xs text-[#415161]">Kennisbank</p>
                  </div>
                  <div className="p-4 bg-[#f8f9fb] rounded-xl">
                    <Sparkles className="w-6 h-6 text-[#288978] mx-auto mb-2" />
                    <p className="text-xs text-[#415161]">AI Assistent</p>
                  </div>
                  <div className="p-4 bg-[#f8f9fb] rounded-xl">
                    <Briefcase className="w-6 h-6 text-[#288978] mx-auto mb-2" />
                    <p className="text-xs text-[#415161]">Projecten</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-xl bg-[#288978]/10 flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-[#288978]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">
                    Vertel ons over uzelf
                  </h2>
                  <p className="text-[#415161]">
                    We personaliseren uw ervaring op basis van uw gegevens
                  </p>
                </div>

                <div className="space-y-5 max-w-md mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">
                      Uw naam *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Bijv. Jan de Vries"
                      className="w-full px-4 py-3 bg-white border-2 border-[#E2E7ED] rounded-xl focus:outline-none focus:border-[#288978] transition-colors text-[#2c3e50] placeholder:text-[#8b97a5]"
                    />
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
                        placeholder="Bijv. Gemeente Amsterdam"
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#E2E7ED] rounded-xl focus:outline-none focus:border-[#288978] transition-colors text-[#2c3e50] placeholder:text-[#8b97a5]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Role Selection */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-xl bg-[#288978]/10 flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-[#288978]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">
                    Wat is uw functie?
                  </h2>
                  <p className="text-[#415161]">
                    Dit helpt ons om relevante content te tonen
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = formData.role === role.id;
                    return (
                      <button
                        key={role.id}
                        onClick={() => setFormData({ ...formData, role: role.id })}
                        className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                          isSelected
                            ? "border-[#288978] bg-[#288978]/5 shadow-md"
                            : "border-[#E2E7ED] hover:border-[#288978]/30 hover:bg-[#f8f9fb]"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              isSelected
                                ? "bg-[#288978] text-white"
                                : "bg-[#f8f9fb] text-[#288978]"
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3
                              className={`font-semibold mb-1 ${
                                isSelected ? "text-[#288978]" : "text-[#2c3e50]"
                              }`}
                            >
                              {role.name}
                            </h3>
                            <p className="text-sm text-[#415161]">
                              {role.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Interests */}
            {currentStep === 4 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-xl bg-[#288978]/10 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-[#288978]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">
                    Wat zijn uw interesses?
                  </h2>
                  <p className="text-[#415161]">
                    Selecteer onderwerpen die u interesseren (optioneel)
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  {interests.map((interest) => {
                    const isSelected = formData.interests.includes(interest.id);
                    return (
                      <button
                        key={interest.id}
                        onClick={() => toggleInterest(interest.id)}
                        className={`px-4 py-2.5 rounded-xl border-2 font-medium transition-all duration-200 ${
                          isSelected
                            ? "border-[#288978] bg-[#288978] text-white"
                            : "border-[#E2E7ED] text-[#415161] hover:border-[#288978]/30 hover:bg-[#f8f9fb]"
                        }`}
                      >
                        {interest.label}
                      </button>
                    );
                  })}
                </div>

                {formData.interests.length > 0 && (
                  <p className="text-center text-sm text-[#288978] mt-4">
                    {formData.interests.length} onderwerp
                    {formData.interests.length > 1 ? "en" : ""} geselecteerd
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="px-8 md:px-12 pb-8 md:pb-12 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
                currentStep === 1
                  ? "text-[#c5cdd6] cursor-not-allowed"
                  : "text-[#415161] hover:text-[#2c3e50] hover:bg-[#f8f9fb]"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Terug
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                canProceed()
                  ? "bg-[#288978] text-white hover:bg-[#1e6b5c] shadow-md hover:shadow-lg"
                  : "bg-[#E2E7ED] text-[#8b97a5] cursor-not-allowed"
              }`}
            >
              {currentStep === 4 ? "Voltooien" : "Volgende"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Skip link */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              login({
                name: "Gebruiker",
                role: "vergunningverlener",
              });
              completeOnboarding();
              router.push("/");
            }}
            className="text-sm text-[#8b97a5] hover:text-[#288978] transition-colors"
          >
            Overslaan en later instellen
          </button>
        </div>
      </div>
    </div>
  );
}
