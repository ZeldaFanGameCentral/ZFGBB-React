import type React from "react";
export const MutedText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-muted">{children}</span>
);
