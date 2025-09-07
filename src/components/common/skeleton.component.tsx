import type React from "react";

export default function Skeleton<
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
