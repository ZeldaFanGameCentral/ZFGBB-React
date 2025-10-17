import Widget from "../components/common/widgets/widget";

export default function UserProfile() {
  return (
    <article>
      <section className="col-12 my-2">
        <Widget widgetTitle={"Profile Summary"}>
          <Outlet />
        </Widget>
      </section>
    </article>
  );
}
