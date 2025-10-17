export type FooterConfig = {
  label: string;
  callback: () => void;
};

interface FooterButtonsProps {
  options: FooterConfig[];
}

const FooterButtons: React.FC<FooterButtonsProps> = ({ options }) => {
  return (
    <div className="flex justify-end">
      {options.map((opt, index) => {
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <button
            key={opt.label}
            onClick={() => opt.callback()}
            className={`
              px-2 py-2 bg-elevated border-2 border-default border-t-0 
              hover:bg-accented transition-colors
              ${isFirst ? "rounded-bl-lg" : "border-r-0"}
              ${isLast ? "rounded-br-lg border-r-2" : ""}
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default FooterButtons;
