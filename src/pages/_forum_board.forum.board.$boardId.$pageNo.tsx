import type { Board, Thread } from "../types/forum";

function BoardTablePaginatorComponent({
  board,
  onPageChange,
  isLoading,
  currentPage,
  maxPageCount,
  className = "",
  // skeletonContainerClassName = "",
  // skeletonClassName = "",
}: {
  board?: Board;
  isLoading: boolean;
  className?: string;
  skeletonContainerClassName?: string;
  skeletonClassName?: string;
} & Omit<BBPaginatorProps, "numPages">) {
  return (
    <div className="flex justify-left scrollbar-thin">
      {
        <BBPaginator
          numPages={!isLoading && board ? board.pageCount : currentPage}
          currentPage={currentPage}
          maxPageCount={maxPageCount}
          onPageChange={onPageChange}
          className={className}
        />
      }
    </div>
  );
}

function BoardTableComponent({
  board,
  isLoading,
}: {
  board?: Board;
  isLoading?: boolean;
}) {
  const columns: BBTableColumn<Thread>[] = [
    {
      key: "icon",
      label: "",
      className: "w-12 shrink-0",
      render: () => (
        <div className="flex flex-col items-center gap-2">
          <div className="theme-topic-normal" />
          <div className="block sm:hidden">
            <div className="theme-post-indicator" />
          </div>
        </div>
      ),
    },
    {
      key: "postIndicator",
      label: "",
      className: "w-8 shrink-0",
      hideOnMobile: true,
      render: () => (
        <div className="flex justify-center">
          <div className="theme-post-indicator" />
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      className: "min-w-0 grow",
      render: (_, thread) => (
        <div className="space-y-2 p-1">
          <h6 className="font-semibold">
            <BBLink to={`/forum/thread/${thread.id}/1`} prefetch="intent">
              {thread.threadName}
            </BBLink>
          </h6>

          <div className="block md:hidden text-sm text-dimmed">
            <span>Author: </span>
            {thread.createdUserId > 0 ? (
              <BBLink
                to={`/user/profile/${thread.createdUser?.id}`}
                prefetch="intent"
              >
                {thread.createdUser?.displayName}
              </BBLink>
            ) : (
              <span>{thread.createdUser?.displayName}</span>
            )}
          </div>

          <div className="flex content-center  gap-4 md:hidden text-sm text-highlighted">
            <span>Replies: {thread.postCount}</span>
            <span>Views: {thread.viewCount}</span>
          </div>

          <div className="block md:hidden text-sm text-highlighted">
            Latest Post by: {thread.latestMessage?.ownerName}
          </div>
        </div>
      ),
    },
    {
      key: "author",
      label: "Author",
      className: "w-24 shrink-0 text-center text-ellipsis overflow-hidden",
      hideOnMobile: true,
      hideOnTablet: true,
      render: (_, thread) =>
        thread.createdUserId > 0 ? (
          <BBLink
            to={`/user/profile/${thread.createdUser?.id}`}
            prefetch="intent"
          >
            {thread.createdUser?.displayName}
          </BBLink>
        ) : (
          <span>{thread.createdUser?.displayName}</span>
        ),
    },
    {
      key: "replies",
      label: "Replies",
      className: "w-20 shrink-0 text-center hidden lg:block",
      hideOnMobile: false,
      hideOnTablet: false,
      render: (_, thread) => (
        <span className="text-dimmed">{thread.postCount}</span>
      ),
    },
    {
      key: "views",
      label: "Views",
      className: "w-20 shrink-0 text-center",
      hideOnMobile: true,
      hideOnTablet: true,
      render: (_, thread) => (
        <span className="text-dimmed">{thread.viewCount}</span>
      ),
    },
    {
      key: "stats",
      label: "Stats",
      className: "w-24 shrink-0 text-center hidden md:block lg:hidden",
      render: (_, thread) => (
        <div className="space-y-1">
          <div className="text-sm text-highlighted">
            Replies: {thread.postCount}
          </div>
          <div className="text-sm text-highlighted">
            Views: {thread.viewCount}
          </div>
        </div>
      ),
    },
    {
      key: "lastPost",
      label: "Latest Post",
      className: "w-48 shrink-0",
      hideOnMobile: true,
      render: (_, thread) => (
        <div className="space-y-1 text-sm">
          <div className="text-sm text-highlighted">
            <span>by </span>
            {thread.latestMessage?.ownerId &&
            thread.latestMessage.ownerId > 0 ? (
              <BBLink
                to={`/user/profile/${thread.latestMessage?.ownerId}`}
                prefetch="intent"
              >
                {thread.latestMessage?.ownerName}
              </BBLink>
            ) : (
              <span>{thread.latestMessage?.ownerName}</span>
            )}
          </div>
          <div className="text-sm text-dimmed">
            {thread.latestMessage?.lastPostTsAsString ? (
              <>
                <span>on </span>
                <span>
                  {new Date(
                    thread.latestMessage?.lastPostTsAsString,
                  ).toLocaleString()}
                </span>
              </>
            ) : null}
          </div>
        </div>
      ),
    },
  ];

  return isLoading && !board ? (
    <BBTable
      columns={columns}
      data={[]}
      emptyMessage="Loading..."
      headerClassName="hidden md:block"
    />
  ) : (
    <BBTable
      columns={columns}
      data={board?.unStickyThreads || []}
      emptyMessage="No threads available"
      headerClassName="hidden md:block"
    />
  );
}

const BoardContainer: React.FC = () => {
  const navigate = useNavigate();
  const { boardId: boardIdParam, pageNo: pageNoParam } = useParams();
  const boardId = parseInt(boardIdParam!);
  const pageNo = parseInt(pageNoParam!);

  const { data: board, isLoading } = useBBQuery<Board>(
    `/board/${boardId}?pageNo=${pageNo}`,
    0,
    0,
  );

  const boardName = useMemo(() => {
    return board?.boardName ?? "Loading...";
  }, [board]);

  const loadNewPage = (currentPageNumber: number) => {
    navigate(`/forum/board/${boardId}/${currentPageNumber}`);
  };

  return (
    <>
      {!isLoading &&
      board &&
      board.childBoards &&
      board?.childBoards?.length > 0 ? (
        <BBWidget widgetTitle={"Child Boards"}>
          <BoardSummaryView subBoards={board.childBoards} />
        </BBWidget>
      ) : null}

      <div className="my-3">
        <BBFlex gap="gap-2">
          <BBLink to="/forum" prefetch="render">
            ZFGC.com
          </BBLink>
          <span>&gt;&gt;</span>
          {!isLoading && board ? (
            <span>{boardName}</span>
          ) : (
            <span>Loading...</span>
          )}
        </BBFlex>
      </div>

      <BoardTablePaginatorComponent
        board={board}
        onPageChange={loadNewPage}
        isLoading={isLoading}
        currentPage={Number(pageNo)}
        className="bg-accented p-4 mb-4"
        skeletonContainerClassName="bg-accented p-4 mb-4 w-full"
        skeletonClassName="p-8 size-full"
      />

      <BBWidget widgetTitle={boardName}>
        <BoardTableComponent board={board} isLoading={isLoading} />
        <BoardTablePaginatorComponent
          board={board}
          onPageChange={loadNewPage}
          isLoading={isLoading}
          currentPage={Number(pageNo)}
          className="bg-accented p-4"
          skeletonContainerClassName="w-full p-4 mb-2"
          skeletonClassName="p-8 size-full"
        />
      </BBWidget>

      {!isLoading ? (
        <div className="my-3">
          <BBFlex gap="gap-2">
            <BBLink to="/forum">ZFGC.com</BBLink>
            <span>&gt;&gt;</span>
            <span>{boardName}</span>
          </BBFlex>
        </div>
      ) : null}
    </>
  );
};

export default BoardContainer;
