import type { Forum } from "@/types/forum";
import type { Route } from "./+types/forum._index";

export default function ForumMain(props: Route.ComponentProps) {
  let forumIndex = props.loaderData;
  const { data } = useBBQuery<Forum>("/board/forum");
  forumIndex = data;

  if (!forumIndex) return <>Loading...</>;
  return (
    <article>
      <section className="grid grid-cols-1 gap-4">
        <BBWidget className="mb-5 my-2">
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
        </BBWidget>

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
}

export function HydrateFallback() {
  return <>Loading...</>;
}

export async function clientLoader(_: Route.LoaderArgs) {
  return undefined as Forum | undefined;
  // const { data: forumIndex } = useBBQuery<Forum>("/board/forum");
  // return forumIndex;
}
