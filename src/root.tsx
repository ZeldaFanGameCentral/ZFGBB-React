import "./assets/App.css";
import UserProvider from "./providers/user/userProvider";
import QueryProvider, { getQueryClient } from "./providers/query/queryProvider";
import RootLayout from "./root.layout";
import { bbQueryOptions } from "./hooks/bbQueryOptions";
import type { User } from "./types/user";
import type { Route } from "./+types/root";

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") ?? "";
  await getQueryClient().prefetchQuery(
    bbQueryOptions<User>(
      "/users/loggedInUser",
      undefined,
      cookie ? { Cookie: cookie } : undefined,
    ),
  );
  return null;
}

export async function clientLoader() {
  await getQueryClient().prefetchQuery(
    bbQueryOptions<User>("/users/loggedInUser"),
  );
}

clientLoader.hydrate = true as const;

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
      <BBReloadPrompt />
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
