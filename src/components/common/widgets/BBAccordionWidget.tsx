interface AccordionProps {
  title: string;
  children: React.ReactNode;
  startExpanded?: boolean;
}

const BBAccordion: React.FC<AccordionProps> = ({
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
          className="cursor-pointer "
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? <Fa6SolidSquareMinus /> : <Fa6SolidSquarePlus />}
          {title}
        </h5>
      </div>
      {expanded && <div className="m-2">{children}</div>}
    </div>
  );
};

export default BBAccordion;
