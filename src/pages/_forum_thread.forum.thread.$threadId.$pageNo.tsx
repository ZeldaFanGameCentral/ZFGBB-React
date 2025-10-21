import type { Route } from "./+types/_forum_thread.forum.thread.$threadId.$pageNo";

// FIXME: Move the ForumThread component into this file.
export default function ForumThreadPage({ params }: Route.ComponentProps) {
  const { threadId, pageNo } = params;
  const currentPage = parseInt(pageNo!);
  const { data: thread } = useBBQuery<Thread>(
    `/thread/${threadId}?pageNo=${currentPage}&numPerPage=10`,
  );

  return (
    <>
      <ForumThread pageNo={pageNo!} thread={thread!} />
    </>
  );
}
