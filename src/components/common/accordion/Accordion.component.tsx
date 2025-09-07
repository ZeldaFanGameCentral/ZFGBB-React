import type React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="m-8">
      <div className="bg-default border-2 border-default p-3">
        <h5
          className="cursor-pointer "
          onClick={() => setExpanded((prev) => !prev)}
        >
          <FontAwesomeIcon
            icon={expanded ? faMinusSquare : faPlusSquare}
            className="mr-2"
          />
          {title}
        </h5>
      </div>
      {expanded && <div className="m-2">{children}</div>}
    </div>
  );
};

export default Accordion;
