import type React from "react";
import { createContext, useState } from "react";
import { useBBQuery } from "../../hooks/useBBQuery";
import type { User } from "../../types/user";

const emptyUser = {
  id: 0,
  displayName: "Guest",
  permissions: [],
} as User;

export const UserContext = createContext<User>(emptyUser);

interface FloatingThemeSwitcherProps {
  theme: string;
  setCurrentTheme: (theme: string) => void;
}

const FloatingThemeSwitcher: React.FC<FloatingThemeSwitcherProps> = ({
  theme,
  setCurrentTheme,
}) => {
  // const themes = import.meta.glob("~/assets/themes/*.css");

  const ThemeSelector: React.FC<FloatingThemeSwitcherProps> = ({
    theme,
    setCurrentTheme,
  }) => {
    // gm112 note: I just removed the dynamic theme options for now.
    const themeOptions = ["Midnight", "Kikori", "Goron", "Sheik"];
    // const themeOptions = useMemo(() => {
    //   return Object.keys(themes).map((key) =>
    //     key.replace("/src/assets/themes/", "").replace(".css", ""),
    //   );
    // }, []);

    return (
      <select
        className="bg-default border border-default rounded-md p-1 capitalize"
        value={theme}
        onChange={(e) => setCurrentTheme(e.target.value)}
      >
        {themeOptions.map((themeName) => (
          <option
            key={String(themeName)}
            className="capitalize"
            value={`theme-${themeName.toLowerCase()}`}
          >
            {themeName}
          </option>
        ))}
      </select>
    );
  };

  return (
    <>
      <div className="z-50 p-1 bg-elevated border-t border-default">
        <div className="flex gap-2 items-center">
          <label className="text-dimmed">Theme:</label>
          <ThemeSelector theme={theme} setCurrentTheme={setCurrentTheme} />
        </div>
      </div>
    </>
  );
};

interface UserProviderProps {
  children?: React.ReactNode;
}
const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data: user } = useBBQuery<User>("/users/loggedInUser");
  const themeClassName = user?.theme ? `theme-${user.theme}` : "theme-midnight";
  const [currentTheme, setCurrentTheme] = useState(themeClassName);

  return (
    <UserContext.Provider value={user ? user : emptyUser}>
      <div id="root" className={currentTheme}>
        {children}
        {import.meta.env.DEV ? (
          <FloatingThemeSwitcher
            theme={currentTheme}
            setCurrentTheme={setCurrentTheme}
          />
        ) : null}
      </div>
    </UserContext.Provider>
  );
};

export default UserProvider;
