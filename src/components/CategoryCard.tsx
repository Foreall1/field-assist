"use client";

import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  articleCount: number;
  slug: string;
  colorClass?: string;
}

export function CategoryCard({
  name,
  description,
  icon: Icon,
  articleCount,
  slug,
  colorClass = "bg-field-pale text-field-primary",
}: CategoryCardProps) {
  return (
    <Link
      href={`/kennisbank/${slug}`}
      className="card-hover group flex flex-col h-full"
    >
      <div className={`p-3 rounded-lg ${colorClass} w-fit mb-4`}>
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="font-semibold text-field-dark mb-2">{name}</h3>

      <p className="text-sm text-gray-600 mb-4 flex-1">{description}</p>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{articleCount} artikelen</span>
        <ArrowRight className="w-4 h-4 text-field-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}
