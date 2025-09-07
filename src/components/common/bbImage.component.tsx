import {
  Suspense,
  lazy,
  type ReactElement,
  type ComponentType,
  type JSX,
  type FC,
} from "react";
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
const lazyImageComponentCache = new Map<string, BBImageLazyComponentType>();

type ImageModule = { default: string };
const images: Record<string, () => Promise<ImageModule>> =
  import.meta.glob<ImageModule>([
    `/src/assets/images/**/*`,
    `/src/assets/themes/**/*`,
  ]);

/**
 * Resolves a path or URL into a usable image source.
 * @param path - Relative path or full URL to the image.
 * @returns A resolved image path or undefined if not found.
 */
async function preloadImage(path: string): Promise<string | undefined> {
  if (URL.canParse(path)) return path;

  const loader = images[`/src/assets/${path}`];
  if (loader) return (await loader()).default;

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
  const key = `${src}::${typeof as === "string" ? as : (as.name ?? "custom")}`;

  if (lazyImageComponentCache.has(key))
    return lazyImageComponentCache.get(key)!;

  const lazyComponent = lazy(async () => {
    const resolvedSrc = await preloadImage(src);
    const ImageComponent: BBImageComponentType = (
      componentProps: BBImageProps,
    ) => {
      const Component = as;
      const props: BBImageProps =
        Component === "img"
          ? {
              decoding: "async",
              loading: "lazy",
              fetchPriority: "high",
              crossOrigin: "anonymous",
              ...componentProps,
            }
          : componentProps;

      return !resolvedSrc ? null : (
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
 * Supports SSR-safe rendering, URL-based images, and Vite glob imports.
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
