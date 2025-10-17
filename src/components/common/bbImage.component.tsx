import type { ReactElement, ComponentType, JSX, FC } from "react";
import Skeleton from "./skeleton.component";

type ImageProps = JSX.IntrinsicElements["img"];
type AsComponent = ("img" | "image") | ComponentType<Partial<ImageProps>>;
type SrcPath = ImagesPath | ThemesPath | `${string}://${string}/${string}`;

/**
 * This type represents the props of the {@link BBImage} component.
 */
export type BBImageProps = Partial<ImageProps> & {
  src: SrcPath;
  fallback?: ReactElement;
  as?: AsComponent;
};
type BBImageComponentType = FC<BBImageProps>;
type BBImageLazyComponentType = ReturnType<typeof lazy>;

// FIXME: remove this lazy cache, since we can avoid doing this with better utilization of lazy.
const lazyImageComponentCache = new Map<string, BBImageLazyComponentType>();
/**
 * Resolves a path or URL into a usable image source.
 * @param path - Relative path or full URL to the image.
 * @returns A resolved image path or undefined if not found.
 */
function resolveSrc(path: string) {
  if (URL.canParse(path) || path) return path;
  if (import.meta.env.DEV)
    console.warn(`Image not found: ${path}. Rendering nothing.`);
  return undefined;
}

/**
 * Lazily creates a component that renders the resolved image.
 * This uses lazy to defer image resolution and component rendering until needed.
 *
 * @param src - The image path or URL to preload.
 * @param as - The component type to render (e.g., "img").
 */
function lazyImageLoader(src: SrcPath, as: AsComponent = "img") {
  const resolvedSrc = resolveSrc(src);
  const key = `${resolvedSrc}::${typeof as === "string" ? as : (as.name ?? "custom")}`;

  if (resolvedSrc && lazyImageComponentCache.has(key))
    return lazyImageComponentCache.get(key)!;

  const lazyComponent = lazy(async () => {
    const ImageComponent: BBImageComponentType = (
      componentProps: BBImageProps,
    ) => {
      if (!resolvedSrc) return null;

      const Component = as;
      const props: BBImageProps =
        Component === "img" || Component === "image"
          ? {
              decoding: "async",
              loading: "lazy",
              fetchPriority: "high",
              crossOrigin: "anonymous",
              ...componentProps,
            }
          : componentProps;

      // FIXME: Move the link preload to an earlier stage of the render lifecycle, so that we can better utilize caching.
      return (
        <>
          {props.loading === "eager" ? (
            <link
              rel="preload"
              href={resolvedSrc}
              crossOrigin="anonymous"
              as="image"
            />
          ) : null}
          <Component {...(props as object)} src={resolvedSrc} />
        </>
      );
    };
    return { default: ImageComponent };
  });

  lazyImageComponentCache.set(key, lazyComponent);
  return lazyComponent;
}

/**
 * The main exported BBImage component.
 * Dynamically resolves images via `preloadImage` and renders them through a lazily loaded component.
 *
 * Example usage:
 * ```tsx
 * <BBImage src="images/logo.png" alt="Logo" />
 * <BBImage src="https://example.com/banner.jpg" alt="Banner" />
 * ```
 *
 * @param src - The image path or URL to load.
 * @param fallback - Optional fallback to render during loading.
 * @param as - Optional component type to render (defaults to `<img>`).
 * @param rest - Other props passed to the rendered component.
 */
export default function BBImage({ src, fallback, as, ...rest }: BBImageProps) {
  if (import.meta.env.DEV && !("alt" in rest))
    console.warn(
      `BBImage component for ${src} is missing an alt prop. This will cause a11y issue.`,
    );

  const LazyImage = lazyImageLoader(src, as ?? "img");
  const MyAss = fallback ?? <Skeleton />;

  return (
    <Suspense fallback={MyAss}>
      <LazyImage {...rest} src={src} key={`${src}::${as ?? "img"}`} />
    </Suspense>
  );
}

if (import.meta.hot)
  import.meta.hot.dispose(() => lazyImageComponentCache.clear());
