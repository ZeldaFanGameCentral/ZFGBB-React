import type { Forum } from "@/types/forum";

export const useForumIndex = () => {
  return useBBQuery<Forum>("/board/forum");
};
