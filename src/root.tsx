import "./assets/App.css";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import UserProvider from "./providers/user/userProvider";
import QueryProvider from "./providers/query/queryProvider";
import RootLayout from "./rootLayout.component";
import { Suspense, lazy } from "react";

const TanStackQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((mod) => ({
        default: mod.ReactQueryDevtools,
      })),
    )
  : null;

export function HydrateFallback() {
  return <></>;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <Meta />
        <Links />
        <base href={import.meta.env.VITE_BASE ?? "/"} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <UserProvider>
        <RootLayout children={<Outlet />} />
      </UserProvider>
      {import.meta.env.DEV && TanStackQueryDevtools ? (
        <Suspense fallback={null}>
          <TanStackQueryDevtools buttonPosition="top-left" />
        </Suspense>
      ) : null}
    </QueryProvider>
  );
}

export function ErrorBoundary() {
  return (
    <main>
      <p>Something went wrong. Please try again later.</p>
    </main>
  );
}

export function meta() {
  return [{ title: "ZFGC.com" }];
}
