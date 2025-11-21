export default function ComponentSandboxLayout() {
  return (
    <article>
      <BBGrid>
        <div>
          <h1>Component Sandbox</h1>
          <p>This is a sandbox for testing components.</p>
        </div>
        <BBFlex>
          <div>
            <h2>BBFlex</h2>
            <BBFlex className="border border-red-500">
              <BBFlex>
                <span>BBFlex</span>
              </BBFlex>
              <BBFlex>
                <span>BBFlex</span>
                <br />
                <span>BBFlex</span>
              </BBFlex>
            </BBFlex>
          </div>
        </BBFlex>
      </BBGrid>
    </article>
  );
}
