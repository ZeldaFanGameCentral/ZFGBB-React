import type { User } from "@/types/user";
export interface UserSignatureProps {
  user?: User;
  isEven?: boolean;
}

export default function UserSignature({ user, isEven }: UserSignatureProps) {
  // FIXME: gm112 note: seems like on the thread view, the backend returns parsed html on user.bioInfo.signature, and on the profile view, user.bioInfo.signatureParsed.... Wtf?
  const signature = (
    user?.bioInfo?.signatureParsed ?? user?.bioInfo?.signature
  )?.trim();
  if (!signature) return null;

  return (
    <div
      className={`shrink border-t border-default ${isEven === true ? "bg-elevated" : isEven === false ? "bg-muted" : ""}`}
    >
      <UserSignatureContent signature={signature} />
    </div>
  );
}
