import type { BBTableColumn } from "@/components/common/layout/BBTable";
import type { BoardSummary } from "../../../types/forum";

interface BoardSummaryViewProps {
  subBoards: BoardSummary[];
}

const BoardSummaryView: React.FC<BoardSummaryViewProps> = ({ subBoards }) => {
  const columns: BBTableColumn<BoardSummary>[] = [
    {
      key: "icon",
      label: "",
      className: "max-w-8 grow",
      render: () => <div className="theme-board-status " />,
    },
    {
      key: "boardInfo",
      label: "Board",
      className: "m-w-0 grow overflow-hidden",
      render: (_, board) => (
        <section>
          <h6 className="font-semibold text-left">
            <BBLink to={`/forum/board/${board.boardId}/1`} prefetch="intent">
              {board.boardName}
            </BBLink>
          </h6>

          <div className="text-sm text-muted">{board.description}</div>

          {board.childBoards && board.childBoards.length > 0 && (
            <div className="text-sm text-highlighted">
              <span className="font-medium">Child boards: </span>
              {board.childBoards.map((cb, index) => (
                <span key={cb.boardId}>
                  <BBLink to={`/forum/board/${cb.boardId}/1`} prefetch="intent">
                    {cb.boardName}
                  </BBLink>
                  {index < board.childBoards!.length - 1 && ", "}
                </span>
              ))}
            </div>
          )}

          <section className="flex flex-col sm:hidden text-sm text-highlighted space-y-1">
            <div className="flex flex-row gap-4 justify-end text-highlighted shrink-0 overflow-hidden">
              <span className="grow text-left">
                Threads: {board.threadCount ?? 0}
              </span>
              <span className="grow text-right">
                Posts: {board.postCount ?? 0}
              </span>
            </div>
            <div className="flex flex-row gap-4 justify-end text-highlighted shrink-0 overflow-hidden text-ellipsis  whitespace-nowrap">
              {board.latestMessageOwnerId && board.latestMessageOwnerId > 0 ? (
                <>
                  <span className="grow text-left">Last post by: </span>

                  <BBLink
                    to={`/user/profile/${board.latestMessageOwnerId}`}
                    prefetch="intent"
                  >
                    {board.latestMessageUserName}
                  </BBLink>
                </>
              ) : null}
            </div>
            <div className="flex flex-row gap-4 justify-end text-highlighted shrink-0">
              {board.threadName ? (
                <>
                  <span className="grow text-left">in </span>
                  <BBLink
                    to={`/forum/thread/${board.latestThreadId}/1`}
                    prefetch="intent"
                    className="shrink  overflow-hidden text-ellipsis  whitespace-nowrap"
                  >
                    {board.threadName}
                  </BBLink>
                </>
              ) : null}
            </div>
            <div className="flex flex-row grow gap-4 justify-end overflow-hidden text-ellipsis  whitespace-nowrap">
              <span className="grow text-left">
                {board.latestMessageCreatedTsAsString ? "on " : null}
              </span>
              <span>
                {board.latestMessageCreatedTsAsString ? (
                  <>
                    {new Date(
                      board.latestMessageCreatedTsAsString,
                    ).toLocaleString()}
                  </>
                ) : null}
              </span>
            </div>
          </section>
        </section>
      ),
    },
    {
      key: "stats",
      label: "Stats",
      className: "shrink-0 overflow-hidden",
      hideOnMobile: true,
      render: (_, board) => (
        <section className="space-y-1 text-sm text-center">
          <div className="text-highlighted">Threads</div>
          <div className="font-medium">{board.threadCount}</div>
          <div className="text-highlighted">Posts</div>
          <div className="font-medium">{board.postCount}</div>
        </section>
      ),
    },
    {
      key: "lastPost",
      label: "Last Post",
      className: "max-w-1/4 grow w-full",
      hideOnMobile: true,
      render: (_, board) => (
        <section className="space-y-1 text-sm ">
          <div className="text-highlighted overflow-hidden text-ellipsis  whitespace-nowrap ">
            {board.latestMessageOwnerId && board.latestMessageOwnerId > 0 ? (
              <>
                <span>Last post by: </span>
                <BBLink
                  to={`/user/profile/${board.latestMessageOwnerId}`}
                  prefetch="intent"
                >
                  {board.latestMessageUserName}
                </BBLink>
              </>
            ) : null}
          </div>
          <div className="text-highlighted overflow-hidden text-ellipsis  whitespace-nowrap ">
            {board.threadName ? (
              <>
                in{" "}
                <BBLink to={`/forum/thread/${board.latestThreadId}/1`}>
                  {board.threadName}
                </BBLink>
              </>
            ) : null}
          </div>
          <div className="text-highlighted overflow-hidden text-ellipsis  whitespace-nowrap ">
            {board.latestMessageCreatedTsAsString ? (
              <>on {board.latestMessageCreatedTsAsString}</>
            ) : null}
          </div>
        </section>
      ),
    },
  ];

  return (
    <BBTable
      columns={columns}
      data={subBoards}
      emptyMessage="No boards available"
      showHeader={false}
      rowClassName="py-2 px-4"
      rowOuterFlexOptions={{
        gap: "gap-4",
      }}
    />
  );
};

export default BoardSummaryView;
