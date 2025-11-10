import { useMediaQuery } from "react-responsive";

export const useBreakpoints = () => {
  const isXs = useMediaQuery({ query: "(max-width: 639px)" });
  const isSm = useMediaQuery({
    query: "(min-width: 640px) and (max-width: 767px)",
  });
  const isMd = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1023px)",
  });
  const isLg = useMediaQuery({
    query: "(min-width: 1024px) and (max-width: 1279px)",
  });
  const isXl = useMediaQuery({
    query: "(min-width: 1280px) and (max-width: 1535px)",
  });
  const is2xl = useMediaQuery({ query: "(min-width: 1536px)" });

  const isMobile = isXs || isSm;
  const isTablet = isMd;
  const isDesktop = isLg || isXl || is2xl;

  return {isXs: isXs, isSm: isSm, isMd: isMd, isLg: isLg, isXl: isXl, is2xl: is2xl, isMobile: isMobile, isTablet: isTablet, isDesktop: isDesktop};
};
