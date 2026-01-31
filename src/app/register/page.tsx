"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/lib/types';
import {
  Eye, EyeOff, Mail, Lock, User, Building2,
  ArrowRight, ArrowLeft, Loader2, CheckCircle
} from 'lucide-react';

const roles: { value: UserRole; label: string; description: string }[] = [
  { value: 'vergunningverlener', label: 'Vergunningverlener', description: 'Behandelt vergunningaanvragen' },
  { value: 'toezichthouder', label: 'Toezichthouder', description: 'Controleert naleving van regels' },
  { value: 'jurist', label: 'Jurist', description: 'Juridische ondersteuning en advies' },
  { value: 'beleidsmedewerker', label: 'Beleidsmedewerker', description: 'Ontwikkelt en evalueert beleid' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState<UserRole>('vergunningverlener');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { signUp } = useUser();

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens bevatten');
      return;
    }

    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }

    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error: signUpError } = await signUp(email, password, {
        name,
        organization,
        role,
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Dit e-mailadres is al geregistreerd');
        } else {
          setError(signUpError.message);
        }
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch {
      setError('Er is iets misgegaan. Probeer het opnieuw.');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-field-50 via-white to-field-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Account aangemaakt!</h1>
            <p className="text-gray-600 mb-6">
              We hebben een bevestigingsmail gestuurd naar <strong>{email}</strong>.
              Klik op de link in de mail om je account te activeren.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-field-primary hover:bg-field-600 text-white font-medium py-3 px-6 rounded-xl transition-colors"
            >
              Naar inloggen
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-field-50 via-white to-field-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-field-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">FIELD Assist</span>
          </Link>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-field-primary' : 'bg-gray-200'}`} />
          <div className={`w-8 h-1 rounded ${step >= 2 ? 'bg-field-primary' : 'bg-gray-200'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-field-primary' : 'bg-gray-200'}`} />
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 1 ? 'Account aanmaken' : 'Vertel ons meer'}
            </h1>
            <p className="text-gray-600">
              {step === 1 ? 'Stap 1 van 2: Inloggegevens' : 'Stap 2 van 2: Over jou'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mailadres
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jouw@gemeente.nl"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-field-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Wachtwoord
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimaal 8 tekens"
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-field-primary focus:border-transparent transition-all"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Bevestig wachtwoord
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Herhaal wachtwoord"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-field-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Next Button */}
              <button
                type="submit"
                className="w-full bg-field-primary hover:bg-field-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Volgende
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Volledige naam
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jan Janssen"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-field-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Organization */}
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                  Organisatie / Gemeente
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="organization"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Gemeente Rotterdam"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-field-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wat is je rol?
                </label>
                <div className="space-y-2">
                  {roles.map((r) => (
                    <label
                      key={r.value}
                      className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                        role === r.value
                          ? 'border-field-primary bg-field-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r.value}
                        checked={role === r.value}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="mt-1 text-field-primary focus:ring-field-primary"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{r.label}</div>
                        <div className="text-sm text-gray-500">{r.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Terug
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-field-primary hover:bg-field-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Bezig...
                    </>
                  ) : (
                    <>
                      Aanmaken
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Al een account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            href="/login"
            className="block w-full text-center py-3 px-4 border-2 border-field-primary text-field-primary font-medium rounded-xl hover:bg-field-50 transition-colors"
          >
            Inloggen
          </Link>
        </div>
      </div>
    </div>
  );
}
