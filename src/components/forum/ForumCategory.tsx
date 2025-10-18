import type { BoardSummary } from "../../types/forum";

const ForumCategory: React.FC<{ title: string; subBoards: BoardSummary[] }> = ({
  title,
  subBoards,
}) => {
  return (
    <Widget widgetTitle={title}>
      <BoardSummaryView subBoards={subBoards} />
    </Widget>
  );
};

export default ForumCategory;
