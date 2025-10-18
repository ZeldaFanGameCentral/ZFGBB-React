import ForumCategory from "../components/forum/ForumCategory";
import { useBBQuery } from "../hooks/useBBQuery";
import type { Forum } from "../types/forum";
import Widget from "../components/common/widgets/Widget";
import BBLink from "../components/common/BBLink";

const ForumMain: React.FC = () => {
  const { data: forumIndex } = useBBQuery<Forum>("/board/forum");

  return (
    <article>
      <section className="grid grid-cols-1 gap-4">
        <Widget className="mb-5 my-2">
          <div className="m-4 text-center animate-pulse">
            <div>
              Hi! We're read-only for now, but make sure to join us on{" "}
              <BBLink
                to="https://discord.gg/NP2nNKjun6"
                target="_blank"
                className="text-highlighted"
              >
                Discord!
              </BBLink>
            </div>
          </div>
        </Widget>

        {forumIndex?.categories?.map((cat) => {
          return (
            <div key={cat.id} className="my-2">
              <ForumCategory title={cat.categoryName} subBoards={cat.boards} />
            </div>
          );
        })}
      </section>
    </article>
  );
};

export default ForumMain;
