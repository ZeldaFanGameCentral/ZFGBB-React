export interface BBMutedTextProps {
  children: React.ReactNode;
  Ass?: React.ElementType;
}

export default function BBMutedText({
  children,
  Ass = "span",
}: BBMutedTextProps) {
  return <Ass className="text-muted">{children}</Ass>;
}
