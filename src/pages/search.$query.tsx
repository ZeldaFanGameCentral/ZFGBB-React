export default function SearchLayout() {
  const { query } = useParams();
  return (
    <article>
      <section className="col-12 my-2">
        <BBForm>
          <BBInput
            label="Search"
            className="w-full p-3 bg-default border border-default  resize-y focus:outline-none focus:ring-2 focus:ring-accented"
            type="text"
            name="query"
            defaultValue={query}
          />
          <button type="submit">
            <Fa6SolidMagnifyingGlass className="w-5 h-5" />
          </button>
        </BBForm>
        <Outlet />
      </section>
    </article>
  );
}
