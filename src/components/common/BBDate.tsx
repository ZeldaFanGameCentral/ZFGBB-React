import { Intl, Temporal } from "@js-temporal/polyfill";

interface BBDateProps {
  dateStr: string | null | undefined;
  fallback?: string;
}

type Parsed =
  | { kind: "datetime"; value: Temporal.PlainDateTime }
  | { kind: "date"; value: Temporal.PlainDate };

function parse(dateStr: string): Parsed | null {
  try {
    return { kind: "datetime", value: Temporal.PlainDateTime.from(dateStr) };
  } catch {}
  try {
    return { kind: "date", value: Temporal.PlainDate.from(dateStr) };
  } catch {}
  return null;
}

const locale =
  typeof navigator !== "undefined" ? navigator.language : undefined;

const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: "short",
  timeStyle: "medium",
});

const dateFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: "short",
});

function format(parsed: Parsed): string {
  return parsed.kind === "datetime"
    ? dateTimeFormatter.format(parsed.value)
    : dateFormatter.format(parsed.value);
}

export default function BBDate({ dateStr, fallback = "—" }: BBDateProps) {
  const parsed = dateStr ? parse(dateStr) : null;
  return (
    <time
      dateTime={parsed ? parsed.value.toString() : undefined}
      suppressHydrationWarning
    >
      {parsed ? format(parsed) : fallback}
    </time>
  );
}
