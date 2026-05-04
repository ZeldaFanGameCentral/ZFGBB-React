export interface BBAccordionProps {
  title: string;
  children: React.ReactNode;
  startExpanded?: boolean;
}

const BBAccordion: React.FC<BBAccordionProps> = ({
  title,
  children,
  startExpanded,
}) => {
  const [expanded, setExpanded] = useState(
    startExpanded !== undefined ? startExpanded : false,
  );

  return (
    <div className="m-8">
      <div className="bg-default border-2 border-default p-3">
        <h5
          className="cursor-pointer align-items-center"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span className="inline-block">
            {expanded ? <Fa6SolidSquareMinus /> : <Fa6SolidSquarePlus />}
          </span>
          <span className="inline-block mx-3">{title}</span>
        </h5>
      </div>
      {expanded && <div className="m-2">{children}</div>}
    </div>
  );
};

export default BBAccordion;
