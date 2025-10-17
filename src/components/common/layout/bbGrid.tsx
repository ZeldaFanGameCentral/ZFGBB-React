interface BBGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: number | string;
  gap?: string;
}

const BBGrid: React.FC<BBGridProps> = ({
  children,
  className = "",
  columns = 12,
  gap = "gap-4",
}) => {
  return (
    <div className={`grid grid-cols-${columns} ${gap} ${className}`}>
      {children}
    </div>
  );
};

export default BBGrid;
