import parse from "html-react-parser/lib/index";

interface UserMessageProps {
  messageText: string;
  isEven: boolean;
}

export default function UserMessage({ messageText, isEven }: UserMessageProps) {
  return (
    <div
      className={`p-3 grow ${isEven ? "bg-elevated" : "bg-muted"} min-h-64 max-h-[calc(100dvh-25dvh)] md:max-h-dvh w-full overflow-auto whitespace-pre-wrap snap-start snap-mandatory`}
    >
      {parse(messageText.toString())}
    </div>
  );
}
