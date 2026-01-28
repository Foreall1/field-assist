import Link from "next/link";
import { Clock, Calendar } from "lucide-react";

interface ArticleCardProps {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: number;
  date: string;
  variant?: "default" | "compact";
}

export function ArticleCard({
  id,
  title,
  summary,
  category,
  readTime,
  date,
  variant = "default",
}: ArticleCardProps) {
  if (variant === "compact") {
    return (
      <Link href={`/artikel/${id}`} className="block group">
        <article className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
          <div className="flex-1">
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-field-pale text-field-primary rounded mb-2">
              {category}
            </span>
            <h3 className="font-medium text-field-dark group-hover:text-field-primary transition-colors line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readTime} min
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/artikel/${id}`} className="block group">
      <article className="card-hover h-full flex flex-col">
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-field-pale text-field-primary rounded">
            {category}
          </span>
        </div>

        <h3 className="font-semibold text-field-dark mb-2 group-hover:text-field-primary transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
          {summary}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readTime} min lezen
          </span>
        </div>
      </article>
    </Link>
  );
}
