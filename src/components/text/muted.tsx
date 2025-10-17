export const MutedText = ({
  children,
  Ass = "span",
}: {
  children: React.ReactNode;
  Ass?: React.ElementType;
}) => <Ass className="text-muted">{children}</Ass>;
