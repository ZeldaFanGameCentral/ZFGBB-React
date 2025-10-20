export default function UserProfile() {
  return (
    <article>
      <section className="col-12 my-2">
        <BBFlex gap="gap-2">
          <BBLink to="/forum" prefetch="render">
            ZFGC.com
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
            ZFGC.com
          </BBLink>
          <span>&gt;&gt;</span>
          <span>Profile</span>
        </BBFlex>
      </section>
    </article>
  );
}
