"use client";

import { Search } from "lucide-react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  size?: "default" | "large";
  showButton?: boolean;
}

export function SearchBar({
  placeholder = "Zoek in de kennisbank...",
  size = "default",
  showButton = true,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/zoeken?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const sizeClasses = {
    default: "py-3",
    large: "py-4",
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-12 ${showButton ? "pr-28" : "pr-4"} ${sizeClasses[size]} rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-field-primary focus:border-transparent text-field-dark`}
      />

      {showButton && (
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary"
        >
          Zoeken
        </button>
      )}
    </form>
  );
}
