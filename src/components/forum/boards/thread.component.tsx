import type React from "react";
import { useMemo, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReply,
  faPen,
  faTrash,
  faShuffle,
  faBook,
  faFlag,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser/lib/index";
import Widget from "../../common/widgets/widget.component";
import { useBBQuery } from "../../../hooks/useBBQuery";
import type { BBPermissionLabel, Message, Thread } from "../../../types/forum";
import MessageEditor from "../messageEditor.component";
import UserLeftPane from "../../user/userLeftPane.component";
import HasPermission from "../../common/security/HasPermission.component";
import BBPaginator from "../../common/paginator/bbPaginator.component";
import { useNavigate } from "react-router";
import BBLink from "@/components/common/bbLink.component";
import BBFlex from "@/components/common/layout/bbFlex.component";

interface ForumThreadProps {
  threadId: string;
  pageNo: string;
}

const ForumThread: React.FC<ForumThreadProps> = ({
  threadId: paramsThreadId,
  pageNo: paramsPageNo,
}) => {
  const navigate = useNavigate();
  const threadId = parseInt(paramsThreadId!);
  const currentPage = parseInt(paramsPageNo!);

  const textAreaRef = useRef("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [msgText, setMsgText] = useState<
    string | number | readonly string[] | undefined
  >("");
  const { data: thread, isLoading } = useBBQuery<Thread>(
    `/thread/${threadId}?pageNo=${currentPage}&numPerPage=10`,
  );
  const [currentMsg, setCurrentMsg] = useState<Message>({} as Message);

  const loadNewPage = (pageNo: number) => {
    navigate(`/forum/thread/${threadId}/${pageNo}`);
  };

  const footer = useMemo(() => {
    return [
      {
        label: "Reply",
        callback: () => setShowReplyBox(!showReplyBox),
        permissions: ["ZFGC_MESSAGE_EDITOR", "ZFGC_MESSAGE_ADMIN"],
      },
      {
        label: "Add Poll",
        callback: () => {},
        permissions: ["ZFGC_MESSAGE_EDITOR", "ZFGC_MESSAGE_ADMIN"],
      },
      {
        label: "Subscribe",
        callback: () => {},
        permissions: [
          "ZFGC_MESSAGE_VIEWER",
          "ZFGC_MESSAGE_EDITOR",
          "ZFGC_MESSAGE_ADMIN",
        ],
      },
      {
        label: "Mark Unread",
        callback: () => {},
        permissions: [
          "ZFGC_MESSAGE_VIEWER",
          "ZFGC_MESSAGE_EDITOR",
          "ZFGC_MESSAGE_ADMIN",
        ],
      },
    ] satisfies BBPermissionLabel[];
  }, [showReplyBox]);

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
            {(thread && !isLoading && (
              <BBLink
                to={`/forum/board/${thread?.boardId}/1`}
                prefetch="intent"
              >
                Board
              </BBLink>
            )) || <span>Loading...</span>}
            <span>&gt;&gt;</span>
            <span>{thread?.threadName}</span>
          </BBFlex>
        </div>

        {thread && !isLoading ? (
          <div className="bg-accented p-4 scrollbar-thin">
            <BBPaginator
              numPages={thread.pageCount}
              currentPage={currentPage}
              onPageChange={loadNewPage}
            />
          </div>
        ) : null}

        {thread && !isLoading ? (
          <Widget widgetTitle={thread ? thread.threadName : ""}>
            <div className="divide-y divide-default">
              {thread?.messages?.map((msg, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={msg.id}>
                    {/* gm112 note: Leaving this here for reference, in case if there's feedback regarding the mobile view being too squashed.
                  <div className="flex flex-col xs:flex-row min-h-[300px]">
                    <div className="sm:w-28 md:w-34 lg:w-64 shrink-0 border-b sm:border-b-0 sm:border-r border-default">
                      <UserLeftPane user={msg.createdUser} />
                    </div>
                  */}

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

                      <div className="flex-1 flex-col shrink min-w-0">
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
                                {new Date(
                                  msg.createdTsAsString,
                                ).toLocaleString()}
                                <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                                  <span className="text-muted">
                                    - 192.168.1.1
                                  </span>
                                </HasPermission>
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
                              <HasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                                <button className="text-toned hover:transition-colors">
                                  <FontAwesomeIcon
                                    icon={faReply}
                                    className="mr-1"
                                  />
                                  <span className="hidden sm:inline">
                                    Reply
                                  </span>
                                </button>
                              </HasPermission>
                              <HasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                                <button
                                  className="text-toned hover:transition-colors"
                                  onClick={() => clickModify(msg)}
                                >
                                  <FontAwesomeIcon
                                    icon={faPen}
                                    className="mr-1"
                                  />
                                  <span className="hidden sm:inline">Edit</span>
                                </button>
                              </HasPermission>
                              <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                                <button className="text-toned hover:transition-colors hidden sm:inline-flex">
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    className="mr-1"
                                  />
                                  Remove
                                </button>
                              </HasPermission>
                              <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                                <button className="text-toned hover:transition-colors hidden md:inline-flex">
                                  <FontAwesomeIcon
                                    icon={faShuffle}
                                    className="mr-1"
                                  />
                                  Split
                                </button>
                              </HasPermission>
                              <HasPermission perms={["ZFGC_MESSAGE_VIEWER"]}>
                                <button className="text-toned hover:transition-colors hidden md:inline-flex">
                                  <FontAwesomeIcon
                                    icon={faBook}
                                    className="mr-1"
                                  />
                                  History
                                </button>
                              </HasPermission>
                              <HasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                                <button className="text-toned hover:transition-colors hidden lg:inline-flex">
                                  <FontAwesomeIcon
                                    icon={faFlag}
                                    className="mr-1"
                                  />
                                  Report
                                </button>
                              </HasPermission>
                              <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                                <button className="text-toned hover:transition-colors hidden lg:inline-flex">
                                  <FontAwesomeIcon
                                    icon={faTriangleExclamation}
                                    className="mr-1"
                                  />
                                  Warn
                                </button>
                              </HasPermission>
                            </BBFlex>
                          </BBFlex>
                        </div>

                        <div
                          className={`p-3 ${isEven ? "bg-elevated" : "bg-muted"} min-h-64 max-h-[calc(100dvh-25dvh)] w-full overflow-auto whitespace-pre-wrap snap-start snap-mandatory scrollbar-thin`}
                        >
                          {parse(msg.currentMessage.messageText.toString())}
                        </div>

                        {msg.createdUser.bioInfo?.signature?.trim() && (
                          <div
                            className={`${isEven ? "bg-elevated" : "bg-muted"} border-t border-default p-3  shrink-0`}
                          >
                            <div className="overflow-x-auto max-h-42 scrollbar-thin">
                              {msg.createdUser.bioInfo?.signature
                                ? parse(msg.createdUser.bioInfo?.signature)
                                : null}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {thread && !isLoading && (
              <div className="bg-accented p-4 scrollbar-thin">
                <BBPaginator
                  numPages={thread.pageCount}
                  currentPage={currentPage}
                  onPageChange={loadNewPage}
                />
              </div>
            )}
          </Widget>
        ) : null}

        {thread && !isLoading ? (
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

      {showReplyBox && <MessageEditor threadId={threadId} />}
    </>
  );
};

export default ForumThread;
