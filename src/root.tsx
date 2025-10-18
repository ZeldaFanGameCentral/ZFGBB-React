import "./assets/App.css";
import UserProvider from "./providers/user/userProvider";
import QueryProvider from "./providers/query/queryProvider";
import RootLayout from "./root.layout";

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
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
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
    <StrictMode>
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
    </StrictMode>
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
  return [
    {
      title: "ZFGC.com",
      charset: "UTF-8",
      viewport: {
        content: "width=device-width, initial-scale=1.0, viewport-fit=cover",
      },
    },
  ];
}
