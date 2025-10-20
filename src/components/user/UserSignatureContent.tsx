import parse from "html-react-parser/lib/index";
export interface UserSignatureContentProps {
  signature: string;
}

export default function UserSignatureContent({
  signature,
}: UserSignatureContentProps) {
  return (
    <div className="overflow-x-auto min-h-24 max-h-42 scrollbar-thin p-1">
      {parse(signature)}
    </div>
  );
}
