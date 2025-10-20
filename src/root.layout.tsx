import { UserContext } from "./providers/user/userProvider";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { displayName } = useContext(UserContext);

  return (
    <div className="grid grid-rows-[1fr_auto] md:grid-rows-[1fr] size-full overflow-hidden">
      <main className="overflow-auto bg-default min-h-0 size-full scrollbar-color-default scrollbar-gutter-stable px-1.5 mr-1">
        <header className="hidden md:flex justify-between items-end border-b-2 border-default bg-default px-2">
          <div className="z-10">
            <div className="relative -z-10 md:mb-[-1.5rem] min-h-[100px] min-w-[480px]">
              <BBImage src="images/logo.png" alt="Logo" />
            </div>
            <HeaderNavigation />
          </div>
          <div className="self-center px-2">
            <p className="mb-0">
              Welcome, {displayName}! <span>Please login or </span>
              <BBLink to="/user/auth/registration">register</BBLink>.
            </p>
            <p className="text-dimmed">Did you miss your activation email?</p>
          </div>
        </header>

        <header className="md:hidden bg-default border-b-2 border-default">
          <div className="flex justify-center pt-2">
            <BBImage className="h-16 w-auto" src="images/logo.png" alt="Logo" />
          </div>
        </header>

        <div className="p-2 sm:p-3.5">{children}</div>
      </main>

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
          <button className="flex items-center justify-center hover:bg-muted transition-colors">
            <Fa6SolidBars />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default RootLayout;
