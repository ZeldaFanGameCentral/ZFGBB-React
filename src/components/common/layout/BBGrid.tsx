import type { ElementType } from "react";

export interface BBGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: number | string;
  gap?: string;
  as?: ElementType;
}

export default function BBGrid({
  children,
  className = "",
  columns = 12,
  gap = "gap-4",
}: BBGridProps) {
  return (
    <div className={`grid grid-cols-${columns} ${gap} ${className}`}>
      {children}
    </div>
  );
}
