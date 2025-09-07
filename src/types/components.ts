interface BBTableColumn<T> {
  key: keyof T | string;
  label: string;
  className?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
}

interface BBTableProps<T> {
  columns: BBTableColumn<T>[];
  data: T[];
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  showHeader?: boolean;
}

type ThemeStandardBackgroundTypes =
  | "default"
  | "muted"
  | "elevated"
  | "accented"
  | "transparent";

type ThemeBackgroundClass =
  | `bg-${ThemeStandardBackgroundTypes}`
  | (`bg-${string}` & {});
