"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  FileCheck,
  Calendar,
  Calculator,
  MessageCircle,
  ClipboardCheck,
  FileWarning,
  Scale,
  FileSearch,
  FileText,
  Map,
  FileEdit,
  Users,
  LucideIcon,
} from "lucide-react";
import quickstartsData from "@/data/quickstarts.json";

const iconMap: Record<string, LucideIcon> = {
  FileCheck,
  Calendar,
  Calculator,
  MessageCircle,
  ClipboardCheck,
  FileWarning,
  Scale,
  FileSearch,
  FileText,
  Map,
  FileEdit,
  Users,
};

interface QuickStartItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
}

interface QuickStartCardsProps {
  selectedRole: string;
}

export function QuickStartCards({ selectedRole }: QuickStartCardsProps) {
  const roleKey = selectedRole || "vergunningverlener";
  const items: QuickStartItem[] =
    quickstartsData[roleKey as keyof typeof quickstartsData] ||
    quickstartsData.vergunningverlener;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {items.map((item) => {
        const Icon = iconMap[item.icon] || FileCheck;
        return (
          <Link
            key={item.id}
            href={item.link}
            className="group relative bg-white rounded-2xl border border-[#E2E7ED] p-6 hover:border-[#288978]/30 hover:shadow-[0_8px_30px_rgba(40,137,120,0.12)] transition-all duration-300"
          >
            <div
              className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}
            >
              <Icon className="w-7 h-7" />
            </div>
            <h3 className="font-semibold text-[#2c3e50] mb-2 group-hover:text-[#288978] transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-[#415161] line-clamp-2 mb-3">
              {item.description}
            </p>
            <span className="inline-flex items-center text-sm font-medium text-[#288978] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Bekijk
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
