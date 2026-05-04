import { useForumIndex } from "@/hooks/useForumIndex";

export default function UserProfile() {
  const { data: forumIndex } = useForumIndex();
  const siteName = forumIndex?.boardName ?? "Loading...";

  return (
    <article>
      <section className="col-12 my-2">
        <BBFlex gap="gap-2">
          <BBLink to="/forum" prefetch="render">
            {siteName}
          </BBLink>
          <span>&gt;&gt;</span>
          <span>Profile</span>
        </BBFlex>

        <div className="my-3">
          <BBWidget widgetTitle={"Profile Summary"}>
            <Outlet />
          </BBWidget>
        </div>

        <BBFlex gap="gap-2">
          <BBLink to="/forum" prefetch="render">
            {siteName}
          </BBLink>
          <span>&gt;&gt;</span>
          <span>Profile</span>
        </BBFlex>
      </section>
    </article>
  );
}
