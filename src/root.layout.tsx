import { Navigate } from "react-router";
import { UserContext } from "./providers/user/userProvider";
import { useInstallStatus } from "./hooks/useInstallStatus";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { displayName, id } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { data: installStatus } = useInstallStatus();

  if (installStatus?.installed === false && !pathname.startsWith("/system")) {
    return <Navigate to="/system/install" replace />;
  }

  return (
    <div className="grid grid-rows-[1fr_auto] md:grid-rows-[1fr] size-full overflow-hidden">
      <main className="overflow-auto bg-default min-h-0 size-full scrollbar-color-default scrollbar-gutter-stable px-1.5 mr-1">
        <header className="hidden md:flex justify-between items-end border-b-2 border-default bg-default px-2">
          <div className="z-10">
            <div className="relative -z-10 md:-mb-6 min-h-[100px] min-w-[480px]">
              <BBImage src="images/logo.png" alt="Logo" loading="eager" />
            </div>
            <HeaderNavigation />
          </div>

          <div className="self-center px-2">
            {Number(id) <= 0 ? (
              <>
                <span>Welcome, {displayName}! Please </span>
                <BBLink to="/user/auth/login">Login</BBLink>
                <span> or </span>
                <BBLink to="/user/auth/registration">register</BBLink>.
                <p className="text-dimmed">
                  Did you miss your activation email?
                </p>
              </>
            ) : (
              <span>Welcome, {displayName}!</span>
            )}
          </div>
        </header>

        <header className="md:hidden bg-default border-b-2 border-default">
          <div className="flex justify-center pt-2 m-h-18 min-w-full items-center">
            <BBImage
              className="h-16 w-auto"
              src="images/logo.png"
              alt="Logo"
              loading="eager"
            />
          </div>
        </header>

        <div className="p-2 sm:p-3.5">{children}</div>
      </main>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <nav className="fixed bottom-12 left-0 right-0 z-50 bg-elevated border-t-2 border-default md:hidden">
            <BBHasPermission perms={["ZFGC_SITE_ADMIN"]}>
              <BBLink
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 hover:bg-muted transition-colors border-b border-default"
              >
                <span className="text-sm">Admin Dashboard</span>
              </BBLink>
            </BBHasPermission>
          </nav>
        </>
      )}

      <nav className="md:hidden bg-elevated border-t-2 border-default">
        <div className="grid grid-cols-5 h-12">
          <BBLink
            to="/"
            className="flex items-center justify-center hover:bg-muted transition-colors"
          >
            <span className="text-xs">Home</span>
          </BBLink>
          <BBLink
            to="/forum"
            prefetch="render"
            className="flex items-center justify-center hover:bg-muted transition-colors"
          >
            <span className="text-xs">Forum</span>
          </BBLink>
          <BBLink
            to="https://discord.gg/NP2nNKjun6"
            target="_blank"
            className="flex items-center justify-center hover:bg-muted transition-colors"
          >
            <span className="text-xs">Chat</span>
          </BBLink>
          <BBLink
            to="http://wiki.zfgc.com"
            target="_blank"
            className="flex items-center justify-center hover:bg-muted transition-colors"
          >
            <span className="text-xs">Wiki</span>
          </BBLink>
          <button
            className="flex items-center justify-center hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen((o) => !o)}
          >
            <Fa6SolidBars />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default RootLayout;
