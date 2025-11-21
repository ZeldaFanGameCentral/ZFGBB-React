export interface BBMutedTextProps {
  children: React.ReactNode;
  Ass?: React.ElementType;
  className?: string;
}

export default function BBMutedText({
  children,
  Ass = "span",
  className = "",
}: BBMutedTextProps) {
  return <Ass className={`text-muted ${className ?? ""}`}>{children}</Ass>;
}
