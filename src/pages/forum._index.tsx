import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import type { Forum } from "@/types/forum";
import type { Route } from "./+types/forum._index";
import { getQueryClient } from "@/providers/query/queryProvider";
import { useForumIndex } from "@/hooks/useForumIndex";

const forumQuery = bbQueryOptions<Forum>("/board/forum");

export async function loader(_: Route.LoaderArgs) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(forumQuery);
  return { dehydratedState: dehydrate(queryClient) };
}

export async function clientLoader(_: Route.ClientLoaderArgs) {
  await getQueryClient().prefetchQuery(forumQuery);
}

export function HydrateFallback() {
  return <>Loading...</>;
}

function ForumContent() {
  const { data: forumIndex } = useForumIndex();
  return (
    <article>
      <section className="grid grid-cols-1 gap-4">
        <BBWidget className="mb-5 my-2">
          <div className="m-4 text-center animate-pulse">
            <div>
              Hi! We're read-only for now, but make sure to join us on{" "}
              <BBLink
                to="https://discord.gg/NP2nNKjun6"
                target="_blank"
                className="text-highlighted"
              >
                Discord!
              </BBLink>
            </div>
          </div>
        </BBWidget>

        {forumIndex?.categories?.map((cat) => {
          return (
            <div key={cat.id} className="my-2">
              <ForumCategory title={cat.categoryName} subBoards={cat.boards} />
            </div>
          );
        })}
      </section>
    </article>
  );
}

export default function ForumMain({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <ForumContent />
    </HydrationBoundary>
  );
}
