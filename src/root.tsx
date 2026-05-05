import "./assets/App.css";
import UserProvider from "./providers/user/userProvider";
import QueryProvider from "./providers/query/queryProvider";
import RootLayout from "./root.layout";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { getResponseStatus } from "./shared/http/response.handler";
import { prefetchQueryDehydrated } from "./shared/http/ssrPrefetch";
import BBForbidden from "./components/common/BBForbidden";
import { HydrationBoundary } from "@tanstack/react-query";
import type { User } from "./types/user";
import type { Route } from "./+types/root";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated<User>(request, "/users/loggedInUser");

const TanStackQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((mod) => ({
        default: mod.ReactQueryDevtools,
      })),
    )
  : null;

export function HydrateFallback() {
  return (
    <QueryProvider>
      <UserProvider>
        <RootLayout>{null}</RootLayout>
      </UserProvider>
    </QueryProvider>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <base href={import.meta.env.VITE_BASE ?? "/"} />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        <title>ZFGC.com</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <QueryProvider>
      <HydrationBoundary state={loaderData?.dehydratedState}>
        <UserProvider>
          <RootLayout children={<Outlet />} />
        </UserProvider>
        {import.meta.env.DEV && TanStackQueryDevtools ? (
          <Suspense fallback={null}>
            <TanStackQueryDevtools buttonPosition="top-left" />
          </Suspense>
        ) : null}
        <BBReloadPrompt />
      </HydrationBoundary>
    </QueryProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error)
    ? error.status
    : getResponseStatus(error);

  if (status === 403) {
    return (
      <main>
        <BBForbidden />
      </main>
    );
  }

  return (
    <main>
      <p>Something went wrong. Please try again later.</p>
    </main>
  );
}
