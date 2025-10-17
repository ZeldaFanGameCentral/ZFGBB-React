import Widget from "../components/common/widgets/widget.component";

const UserLogout: React.FC = () => {
  return (
    <Widget widgetTitle={"Logout"}>
      <div className="flex flex-col md:flex-row p-4">
        <p>You have been successfully logged out.</p>
      </div>
    </Widget>
  );
};

export default UserLogout;
