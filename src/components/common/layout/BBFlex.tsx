import type { ElementType } from "react";

export interface BBFlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: "row" | "col";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  wrap?: boolean;
  gap?: string;
  as?: ElementType;
}

export default function BBFlex({
  children,
  className = "",
  direction = "row",
  justify = "start",
  align = "start",
  wrap = false,
  gap = "0",
}: BBFlexProps) {
  const flexDirection = direction === "col" ? "flex-col" : "flex-row";
  const justifyContent = {
    start: "justify-start",
    end: "justify-end",
    center: "justify-center",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  }[justify];

  const alignItems = {
    start: "items-start",
    end: "items-end",
    center: "items-center",
    baseline: "items-baseline",
    stretch: "items-stretch",
  }[align];

  const flexWrap = wrap ? "flex-wrap" : "flex-nowrap";

  return (
    <div
      className={`flex ${flexDirection} ${justifyContent} ${alignItems} ${flexWrap} ${gap} ${className}`}
    >
      {children}
    </div>
  );
}
