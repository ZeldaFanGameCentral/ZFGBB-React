import BBLink, { type BBLinkProps } from "../common/bbLink";

interface NavTabProps extends Omit<BBLinkProps, "relative"> {
  title: string;
}

const NavTab: React.FC<NavTabProps> = ({ title, ...props }) => {
  return (
    <div className="flex px-4 mx-1 items-center border-2 border-default bg-muted border-b-0 h-8 rounded-t-lg">
      <BBLink {...props} relative="path" className=" hover:text-highlighted">
        {title}
      </BBLink>
    </div>
  );
};

const Navigator: React.FC = () => {
  return (
    <nav className="hidden md:flex items-end">
      <NavTab title="Home" to="/" />
      <NavTab title="Forum" to="/forum" prefetch="intent" />
      <div className="flex px-4 mx-1 items-center border-2 border-default bg-muted border-b-0 h-8 rounded-t-lg">
        <BBLink
          to={"https://discord.gg/NP2nNKjun6"}
          relative="path"
          target="_blank"
          className=" hover:text-highlighted"
        >
          Chat
        </BBLink>
      </div>
      <div className="flex px-4 mx-1 items-center border-2 border-default bg-muted border-b-0 h-8 rounded-t-lg">
        <BBLink
          to={"http://wiki.zfgc.com"}
          relative="path"
          target="_blank"
          className=" hover:text-highlighted"
        >
          Wiki
        </BBLink>
      </div>
      <NavTab title="Projects" to="/projects" />
      <NavTab title="Resources" to="/resources" />
    </nav>
  );
};

export default Navigator;
