import Widget from "../components/common/widgets/widget";

const UserRegistration: React.FC = () => {
  return (
    <Widget widgetTitle={"Registration"}>
      <div className="flex flex-col md:flex-row p-4">
        <p>Please fill out the form below to register your account.</p>
      </div>
    </Widget>
  );
};

export default UserRegistration;
