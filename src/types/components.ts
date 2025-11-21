type ThemeStandardBackgroundTypes =
  | "default"
  | "muted"
  | "elevated"
  | "accented"
  | "transparent";

// oxlint-disable-next-line no-unused-vars
type ThemeBackgroundClass =
  | `bg-${ThemeStandardBackgroundTypes}`
  | (`bg-${string}` & {});
