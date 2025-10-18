import Widget from "../components/common/widgets/Widget";

const UserLogin: React.FC = () => {
  return (
    <Widget widgetTitle={"Login"}>
      <div className="flex flex-col md:flex-row p-4">
        <p>Please enter your credentials to log in.</p>
      </div>
    </Widget>
  );
};

export default UserLogin;
