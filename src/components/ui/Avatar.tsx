import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || "Avatar"}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  if (name) {
    return (
      <div
        className={`
          ${sizes[size]}
          rounded-full bg-field-pale text-field-primary
          flex items-center justify-center font-medium
          ${className}
        `}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full bg-field-pale
        flex items-center justify-center
        ${className}
      `}
    >
      <User className={`${iconSizes[size]} text-field-primary`} />
    </div>
  );
}
