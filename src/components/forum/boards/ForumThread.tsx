import type { Thread } from "@/types/forum";
import parse from "html-react-parser/lib/index";

export interface ForumThreadProps {
  pageNo: string;
  thread?: Thread;
}

const ForumThread: React.FC<ForumThreadProps> = ({
  pageNo: paramsPageNo,
  thread,
}) => {
  const navigate = useNavigate();
  const currentPage = parseInt(paramsPageNo!);
  const threadId = thread?.id;

  // const textAreaRef = useRef("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [, setMsgText] = useState<
    string | number | readonly string[] | undefined
  >("");

  // const { data: thread, isLoading } = useBBQuery<Thread>(
  //   `/thread/${threadId}?pageNo=${currentPage}&numPerPage=10`,
  // );
  const [, setCurrentMsg] = useState<Message>({} as Message);

  const loadNewPage = (pageNo: number) => {
    navigate(`/forum/thread/${threadId}/${pageNo}`);
  };

  // const footer = useMemo(() => {
  //   return [
  //     {
  //       label: "Reply",
  //       callback: () => setShowReplyBox(!showReplyBox),
  //       permissions: ["ZFGC_MESSAGE_EDITOR", "ZFGC_MESSAGE_ADMIN"],
  //     },
  //     {
  //       label: "Add Poll",
  //       callback: () => {},
  //       permissions: ["ZFGC_MESSAGE_EDITOR", "ZFGC_MESSAGE_ADMIN"],
  //     },
  //     {
  //       label: "Subscribe",
  //       callback: () => {},
  //       permissions: [
  //         "ZFGC_MESSAGE_VIEWER",
  //         "ZFGC_MESSAGE_EDITOR",
  //         "ZFGC_MESSAGE_ADMIN",
  //       ],
  //     },
  //     {
  //       label: "Mark Unread",
  //       callback: () => {},
  //       permissions: [
  //         "ZFGC_MESSAGE_VIEWER",
  //         "ZFGC_MESSAGE_EDITOR",
  //         "ZFGC_MESSAGE_ADMIN",
  //       ],
  //     },
  //   ] satisfies BBPermissionLabel[];
  // }, [showReplyBox]);

  const clickModify = (msg: Message) => {
    setShowReplyBox(true);
    setMsgText(
      msg.currentMessage.unparsedText as
        | string
        | number
        | readonly string[]
        | undefined,
    );
    setCurrentMsg(msg);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="mt-2">
          <BBFlex gap="gap-2">
            <BBLink to="/forum" prefetch="render">
              ZFGC.com
            </BBLink>
            <span>&gt;&gt;</span>
            {(thread && (
              <BBLink to={`/forum/board/${thread.boardId}/1`} prefetch="intent">
                Board
              </BBLink>
            )) || <span>Loading...</span>}
            <span>&gt;&gt;</span>
            <span>{thread?.threadName}</span>
          </BBFlex>
        </div>
        <div className="bg-accented p-4 scrollbar-thin">
          <BBPaginator
            numPages={thread?.pageCount ?? currentPage}
            currentPage={currentPage}
            onPageChange={loadNewPage}
          />
        </div>

        <BBWidget widgetTitle={thread?.threadName}>
          <div className="divide-y divide-default">
            {thread?.messages?.map((msg, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={msg.id}>
                  <div className="flex flex-row min-h-[300px]">
                    <div
                      className={`w-28 md:w-34 lg:w-64 shrink-0 border-r ${isEven ? "bg-elevated" : "bg-muted"} border-default`}
                    >
                      <UserLeftPane
                        user={msg.createdUser}
                        backgrounds={{
                          profileInfoContainer: `${isEven ? "bg-elevated" : "bg-muted"}`,
                        }}
                      />
                    </div>

                    <div className="flex flex-1 flex-col grow min-w-0">
                      <div
                        className={`border-b border-default p-3 ${isEven ? "bg-elevated" : "bg-muted"} shrink-0 min-h-[76px] flex items-start`}
                      >
                        <BBFlex
                          justify="between"
                          align="center"
                          className="gap-2 overflow-hidden min-w-0 size-fit whitespace-nowrap"
                          wrap={false}
                        >
                          <div className="text-sm">
                            <div>
                              {new Date(msg.createdTsAsString).toLocaleString()}
                              <BBHasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                                <span className="text-muted">
                                  - 192.168.1.1
                                </span>
                              </BBHasPermission>
                            </div>
                            {msg.currentMessage.updatedTsAsString && (
                              <div className="text-muted">
                                Last Edit:
                                {new Date(
                                  msg.currentMessage.updatedTsAsString,
                                ).toLocaleString()}
                              </div>
                            )}
                          </div>

                          <BBFlex gap="gap-2" wrap={true} className="text-sm">
                            <BBHasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                              <button className="text-toned hover:transition-colors">
                                <Fa6SolidReply className="mr-1" />
                                <span className="hidden sm:inline">Reply</span>
                              </button>
                            </BBHasPermission>
                            <BBHasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                              <button
                                className="text-toned hover:transition-colors"
                                onClick={() => clickModify(msg)}
                              >
                                <Fa6SolidPen className="mr-1" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                            </BBHasPermission>
                            <BBHasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                              <button className="text-toned hover:transition-colors hidden sm:inline-flex">
                                <Fa6SolidTrashCan className="mr-1" />
                                Remove
                              </button>
                            </BBHasPermission>
                            <BBHasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                              <button className="text-toned hover:transition-colors hidden md:inline-flex">
                                Split
                              </button>
                            </BBHasPermission>
                            <BBHasPermission perms={["ZFGC_MESSAGE_VIEWER"]}>
                              <button className="text-toned hover:transition-colors hidden md:inline-flex">
                                <Fa6SolidShuffle className="mr-1" />
                                History
                              </button>
                            </BBHasPermission>
                            <BBHasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                              <button className="text-toned hover:transition-colors hidden lg:inline-flex">
                                <Fa6SolidFlag className="mr-1" />
                                Report
                              </button>
                            </BBHasPermission>
                            <BBHasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                              <button className="text-toned hover:transition-colors hidden lg:inline-flex">
                                <Fa6SolidTriangleExclamation className="mr-1" />
                                Warn
                              </button>
                            </BBHasPermission>
                          </BBFlex>
                        </BBFlex>
                      </div>

                      <div
                        className={`p-3 grow ${isEven ? "bg-elevated" : "bg-muted"} min-h-64 sm:max-h-[calc(100dvh-25dvh)] md:max-h-dvh w-full overflow-auto whitespace-pre-wrap snap-start snap-mandatory`}
                      >
                        {parse(msg.currentMessage.messageText.toString())}
                      </div>

                      <div
                        className={`shrink ${msg.createdUser.bioInfo?.signature?.trim() ? `border-t border-default ${isEven ? "bg-elevated" : "bg-muted"}` : ""}`}
                      >
                        {msg.createdUser.bioInfo?.signature?.trim() && (
                          <div className="overflow-x-auto min-h-24 max-h-42 scrollbar-thin p-1">
                            {parse(msg.createdUser.bioInfo?.signature)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-accented p-4 scrollbar-thin">
            <BBPaginator
              numPages={thread?.pageCount ?? currentPage}
              currentPage={currentPage}
              onPageChange={loadNewPage}
            />
          </div>
        </BBWidget>
        {thread ? (
          <footer className="mt-2">
            <BBFlex gap="gap-2">
              <BBLink to="/forum" prefetch="render">
                ZFGC.com
              </BBLink>
              <span>&gt;&gt;</span>

              <BBLink
                to={`/forum/board/${thread?.boardId}/1`}
                prefetch="intent"
              >
                Board
              </BBLink>
              <span>&gt;&gt;</span>
              <span>{thread?.threadName}</span>
            </BBFlex>
          </footer>
        ) : null}
      </div>

      {showReplyBox && threadId && <MessageEditor threadId={threadId} />}
    </>
  );
};

export default ForumThread;
