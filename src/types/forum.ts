import type { BaseBB, BBPermission } from "./api";
import type { User } from "./user";

export type Forum = BaseBB & {
  categories: Category[];
  boardName: string;
};
export type Board = BaseBB & {
  boardName: string;
  description: string;
  categoryId: number;
  threadCount: number;
  parentBoardId: number;
  stickyThreads: Thread[];
  unStickyThreads: Thread[];
  pageCount: number;
  childBoards?: BoardSummary[];
};

// FIXME: #98 Id is undefined on some responses, so the types are wrong for BaseBB.
export type BoardSummary = BaseBB & {
  boardId: number;
  description: string;
  boardName: string;
  threadCount: number;
  postCount: number;
  latestMessageId?: number;
  latestThreadId?: number;
  latestMessageOwnerId?: number;
  latestMessageUserName?: string;
  categoryId: number;
  parentBoardId: number;
  latestMessageCreatedTsAsString: string;
  threadName: string;

  childBoards?: ChildBoard[];
};

export type ChildBoard = {
  boardId: number;
  boardName: string;
  parentBoardId: number;
};

export type Category = BaseBB & {
  categoryName: string;
  description: string;
  parentCategoryId: number;
  boards: BoardSummary[];
};

export type Thread = BaseBB & {
  threadName: string;
  lockedFlag: boolean;
  pinnedFlag: boolean;
  boardId: number;
  createdUserId: number | null;
  createdUser?: User | null;
  postCount: number;
  viewCount: number;
  pageCount: number;
  pollInfo?: PollInfo;

  messages: Message[];
  latestMessage?: LatestMessage;
};

export type LatestMessage = {
  threadId: number;
  threadName: string;
  messageId: number;
  messageHistoryId: number;
  createdTsAsString: string;
  ownerName: string;
  ownerId: number;
  lastPostTsAsString: string;
};

export type Message = BaseBB & {
  ownerId: number | null;
  threadId: number;
  currentMessage: MessageHistory;

  createdUser?: User | null;
  createdTsAsString: string;
};

export type MessageHistory = BaseBB & {
  messageId: number;
  messageText: string;
  unparsedText: string;
  currentFlag?: boolean;
  createdTsAsString: string;
  updatedTsAsString: string;
};

export type BBPermissionLabel = {
  label: string;
  callback: () => void;
  permissions: BBPermission[];
};

export type BBLookup = {
  label: string;
  value: number;
};

export type PollChoice = BaseBB & {
  pollId?: number;
  choiceText?: string;
  activeFlag: boolean;
  votes: number;
  seqno: number;
  percentage: number;
};

export type PollInfo = BaseBB & {
  pollQuestion?: string;
  threadId: number;
  votingLockedFlag: boolean;
  expireTimeAsString: string;
  hideResultsFlag: boolean;
  changeVoteFlag: boolean;
  createdUserId: number;
  guestVoteFlag: boolean;
  guestVoteCount: number;
  resetPoll: boolean;
  maxVotes: number;
  votes: number;

  answers: PollChoice[];
};
