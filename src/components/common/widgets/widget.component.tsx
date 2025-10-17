interface WidgetProps {
  widgetTitle?: string;
  className?: string;
  children: React.ReactNode;
}

const Widget: React.FC<WidgetProps> = ({
  widgetTitle,
  className = "",
  children,
}) => {
  return (
    <section className={`bg-accented border-2 border-default ${className}`}>
      {widgetTitle && (
        <h6 className="p-1 m-0 font-bold border-b-2 border-default bg-accented ">
          {widgetTitle}
        </h6>
      )}
      <div>{children}</div>
    </section>
  );
};

export default Widget;
