export default function BBSkeleton<
  PropsType extends React.HTMLAttributes<HTMLDivElement> &
    React.PropsWithChildren,
>({ className = "", style, ...rest }: PropsType) {
  return (
    <div
      {...rest}
      className={`
        inline-block w-full h-full rounded-lg animate-pulse bg-gradient-to-r from-muted to-elevated
        ${className}
      `}
      style={style}
    />
  );
}
