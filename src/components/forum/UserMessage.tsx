import parse, {
  domToReact,
  type DOMNode,
  type HTMLReactParserOptions,
} from "html-react-parser/lib/index";
import type { RoutePaths } from "@/components/common/BBLink";

interface UserMessageProps {
  messageText: string;
  isEven: boolean;
}

const PARSE_OPTIONS: HTMLReactParserOptions = {
  replace(node) {
    const element = node;
    if (element.type !== "tag" || element.name !== "a") return;
    const ass = element.attribs?.["class"] ?? "";
    if (!ass.split(/\s+/).includes("bb-resource-link")) return;
    const href = element.attribs?.["href"];
    if (!href) return;

    // FIXME: This is kind of a hack, we'll have to make this not suck Eggman's ass
    return (
      <BBLink to={href as RoutePaths} className={ass}>
        {domToReact((element.children as DOMNode[]) ?? [], PARSE_OPTIONS)}
      </BBLink>
    );
  },
};

export default function UserMessage({ messageText, isEven }: UserMessageProps) {
  return (
    <div
      className={`p-3 grow ${isEven ? "bg-elevated" : "bg-muted"} min-h-64 max-h-[calc(100dvh-25dvh)] md:max-h-dvh w-full overflow-auto whitespace-pre-wrap snap-start snap-mandatory`}
    >
      {parse(messageText.toString(), PARSE_OPTIONS)}
    </div>
  );
}
