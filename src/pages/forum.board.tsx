export default function ForumBoardLayout() {
  const navigation = useNavigation();
  return (
    <article>
      <section className="row">
        <div className="col-12 my-2">
          {navigation.state === "loading" ? (
            <div>
              <p>Loading...</p>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </section>
    </article>
  );
}
