import { HydrationBoundary } from "@tanstack/react-query";
import type { Thread } from "@/types/forum";
import type { Route } from "./+types/_forum_thread.forum.thread.$threadId.$pageNo";
import { getQueryClient } from "@/providers/query/queryProvider";
import { prefetchQueryDehydrated } from "@/shared/http/ssrPrefetch";

export const loader = ({ request, params }: Route.LoaderArgs) =>
  prefetchQueryDehydrated<Thread>(
    request,
    `/thread/${params.threadId}?pageNo=${params.pageNo}&numPerPage=10`,
  );

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await getQueryClient().prefetchQuery(
    bbQueryOptions<Thread>(
      `/thread/${params.threadId}?pageNo=${params.pageNo}&numPerPage=10`,
    ),
  );
}

function ThreadContent({ params }: { params: Route.ComponentProps["params"] }) {
  const { threadId, pageNo } = params;
  const currentPage = parseInt(pageNo!);
  const { data: thread } = useBBQuery<Thread>(
    `/thread/${threadId}?pageNo=${currentPage}&numPerPage=10`,
  );

  return <ForumThread pageNo={pageNo!} thread={thread!} />;
}

export default function ForumThreadPage({
  loaderData,
  params,
}: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <ThreadContent params={params} />
    </HydrationBoundary>
  );
}
