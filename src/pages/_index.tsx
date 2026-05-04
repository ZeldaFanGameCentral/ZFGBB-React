export default () => {
  return (
    <article>
      <BBGrid columns="1 lg:grid-cols-2" as="section">
        <div className="my-2">
          <BBWidget widgetTitle="Featured Project">
            <BBGrid columns="1 lg:grid-cols-2" className="p-4" as="header">
              <BBFlex justify="center">
                <BBImage
                  className="h-38 max-h-38 min-w-full object-cover border-default rounded border"
                  src="images/potm/triforceSaga.png"
                  alt="Triforce Saga project screenshot"
                  loading="eager"
                />
              </BBFlex>
              <section>
                <h5 className="text-highlighted">Triforce Saga</h5>
                <h6 className="text-dimmed">Developer: chaoazul1</h6>
              </section>
            </BBGrid>
          </BBWidget>
        </div>

        <div className="my-2">
          <BBWidget widgetTitle="Recent Activity">
            <div className="p-4">
              <h6 className="text-highlighted">7/23/2024 - blah blah blah</h6>
              <div>Test content</div>
            </div>
          </BBWidget>
        </div>
      </BBGrid>

      <BBGrid>
        <div className="my-2">
          <BBWidget widgetTitle="Announcements">
            <article className="p-4">
              <header>
                <h1 className="text-4xl text-highlighted">
                  It's dangerous to go alone!
                </h1>
                <h2 className="text-base italic text-muted">
                  Date: 04/05/2025
                </h2>
              </header>
              <main className="mt-4">
                <p>
                  Slowly the site is coming back together. We could use your
                  help! If you're interested, check out the repo on GitHub for
                  ZFGC.com! \o/
                  <br />
                  <BBLink
                    to="https://github.com/ZeldaFanGameCentral/ZFGBB-React"
                    target="_blank"
                    className="text-highlighted"
                  >
                    Come join the effort!
                  </BBLink>
                  <br />
                </p>
              </main>
            </article>
          </BBWidget>
        </div>
      </BBGrid>
    </article>
  );
};

export function meta() {
  return [{ title: "Home" }];
}
