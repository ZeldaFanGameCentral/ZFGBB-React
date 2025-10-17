import BBFlex from "../layout/bbFlex";

export default function BBTable<T extends object>({
  columns,
  data,
  className = "",
  headerClassName = "",
  rowClassName = "",
  onRowClick,
  emptyMessage = "No data available",
  showHeader = true,
}: BBTableProps<T>) {
  const getRowClassName = (row: T, index: number): string => {
    const baseClass = "hover:bg-elevated transition-colors";
    const stripeClass = index % 2 === 0 ? "bg-muted" : "bg-elevated";
    const customClass =
      typeof rowClassName === "function"
        ? rowClassName(row, index)
        : rowClassName;
    const clickableClass = onRowClick ? "cursor-pointer" : "";

    return `${baseClass} ${stripeClass} ${customClass} ${clickableClass}`.trim();
  };

  const getColumnVisibilityClass = (column: BBTableColumn<T>): string => {
    let classes = "";
    if (column.hideOnMobile) classes += "hidden sm:block ";
    if (column.hideOnTablet) classes += "hidden md:block ";
    return classes.trim();
  };

  return (
    <div className={`border border-default ${className}`}>
      {showHeader && (
        <div
          className={`bg-elevated border-b-2 border-default ${headerClassName}`}
        >
          <BBFlex className="p-4 font-semibold" align="center">
            {columns.map((column) => (
              <div
                key={String(column.key)}
                className={`${column.className || ""} ${getColumnVisibilityClass(column)}`}
              >
                {column.label}
              </div>
            ))}
          </BBFlex>
        </div>
      )}

      <div className="divide-y divide-default">
        {data.length === 0 ? (
          <div className="p-8 text-center bg-muted">{emptyMessage}</div>
        ) : (
          data.map((row, index) => (
            <div
              key={String((row as { [key: string]: unknown }).id ?? index)}
              className={getRowClassName(row, index)}
              onClick={() => onRowClick?.(row, index)}
            >
              <BBFlex align="center">
                {columns.map((column) => (
                  <div
                    key={String(column.key)}
                    className={`${column.className || ""} ${getColumnVisibilityClass(column)}`}
                  >
                    {column.render
                      ? column.render(row[column.key as keyof T], row, index)
                      : String(row[column.key as keyof T] || "")}
                  </div>
                ))}
              </BBFlex>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
