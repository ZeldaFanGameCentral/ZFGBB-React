import Widget from "../common/widgets/widget";
import type { BoardSummary } from "../../types/forum";
import BoardSummaryView from "./boards/boardSummary";

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
