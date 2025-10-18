const Sonic: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="my-2">
        <Widget widgetTitle="Sonic">
          <div className="flex flex-col md:flex-row justify-center p-4">
            <img
              src="https://pa1.aminoapps.com/7508/074c64ca038d1e4a61d03fede5555ef1fbc047c5r1-640-640_hq.gif"
              alt="Sonic animation"
              className="max-w-full h-auto"
            />
          </div>
        </Widget>
      </div>
    </div>
  );
};

export default Sonic;
