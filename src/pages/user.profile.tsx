export default function UserProfile() {
  return (
    <article>
      <section className="col-12 my-2">
        <BBWidget widgetTitle={"Profile Summary"}>
          <Outlet />
        </BBWidget>
      </section>
    </article>
  );
}
