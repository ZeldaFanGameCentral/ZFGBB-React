import type { BoardSummary } from "../../types/forum";

const ForumCategory: React.FC<{ title: string; subBoards: BoardSummary[] }> = ({
  title,
  subBoards,
}) => {
  return (
    <BBWidget widgetTitle={title}>
      <BoardSummaryView subBoards={subBoards} />
    </BBWidget>
  );
};

export default ForumCategory;
