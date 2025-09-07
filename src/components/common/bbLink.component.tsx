import { Link, type LinkProps, type Register } from "react-router";

/**
 * React-Router generates a type for the routes, so we alias {@link Register} to
 * make it easier to use.
 * @see {@link https://reactrouter.com/7.6.3/start/framework/routing}
 */
export type RouteParams = Register["pages"];

/**
 * Extracts the dynamic segments from a route path and replaces them with
 * strings. This is used to build the `to` prop for the `BBLink` component.
 * @see {@link RouteParams}
 */
type ReplaceParamsWithString<T extends string> =
  T extends `${infer Start}:${infer Param}/${infer Rest}` // Recursively process segments with dynamic parts
    ? `${Start}:${Param}/${ReplaceParamsWithString<Rest>}` // Replace dynamic part and recurse into the rest
    : T extends `${infer Start}:${infer Param}` // Handle the last dynamic part (e.g., `/forum/:boardId`)
      ? `${Start}:${Param}` // Replace the dynamic segment with string
      : T | (string & {}); // Return the path as is if no dynamic segments

/**
 * This type extracts the keys from the {@link RouteParams} type to build a string.
 * It is used as the generic type for {@link ReplaceParamsWithString} by {@link RoutePaths}.
 */
type RouteKeys = Exclude<keyof RouteParams, "/*">;

/**
 * gm112 note: To debug this, just hover over `RoutePaths` and see what it expands to.
 *
 * It's a recursive type that extracts the keys from the `RouteKeys` type to
 * build a string using {@link ReplaceParamsWithString}.
 * @extends ReplaceParamsWithString - Extends the {@link ReplaceParamsWithString} type to handle the `RouteKeys` type.
 */
export type RoutePaths = ReplaceParamsWithString<RouteKeys>;

/**
 * This type is used to define the `to` prop for the `BBLink` component.
 * It supports both static and dynamic routes, e.g., `/forum/board/19/1`.
 * @extends LinkProps - Extends the {@link LinkProps} type to add the `to` prop.
 * @see {@link RoutePaths}
 */
export type BBLinkProps = Omit<LinkProps, "to"> & {
  to: RoutePaths | `${string}://${string}/${string}`;
};

/**
 * This component is a wrapper around the {@link Link} component that provides
 * a styled link component with consistent styling.
 * It also supports dynamic routes, e.g., `/forum/:boardId`.
 *
 * Usage:
 * ```tsx
 * <BBLink to="/forum/board/19/1">Forum</BBLink>
 * ```
 * @param {BBLinkProps} props - The {@link BBLinkProps} to pass to the {@link BBLink} component.
 * @extends Link - Extends the {@link Link} component to add the `to` prop.
 * @see {@link BBLinkProps}
 */
export default (props: BBLinkProps) => <Link {...props} />;
