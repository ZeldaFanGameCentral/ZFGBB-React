import type React from "react";
import Widget from "../components/common/widgets/widget.component";
import { useBBQuery } from "../hooks/useBBQuery";
import type { User } from "../types/user";
import UserLeftPane from "../components/user/userLeftPane.component";
import Accordion from "../components/common/accordion/Accordion.component";
import { useParams } from "react-router";

const UserProfileMaster: React.FC = () => {
  const { userId } = useParams();
  const { data: user } = useBBQuery<User>(`/user-profile/${userId}`);

  return (
    <div className="flex flex-col md:flex-row ">
      {user ? (
        <span className="lg:w-1/4">
          <UserLeftPane user={user} />
        </span>
      ) : null}
      <div className="col-span-12 md:col-span-9 w-full">
        <Accordion title="Bio Information">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium  mb-1">
                Displayname
              </label>
              <input
                type="text"
                value={user?.displayName || ""}
                className="w-full p-2 bg-default border border-default "
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium  mb-1">
                Personal Text
              </label>
              <input
                type="text"
                value={user?.bioInfo?.personalText || ""}
                className="w-full p-2 bg-default border border-default "
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium  mb-1">
                Date of Birth
              </label>
              <input
                type="text"
                placeholder="MM/dd/YYYY"
                className="w-full p-2 bg-default border border-default "
              />
            </div>

            <div>
              <label className="block text-sm font-medium  mb-1">Gender</label>
              <select className="w-full p-2 bg-default border border-default ">
                <option value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">Non-binary/Other</option>
                <option value="4">Prefer not to say</option>
              </select>
            </div>
          </form>
        </Accordion>

        <Accordion title="Contact Information">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium  mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full p-2 bg-default border border-default "
              />
            </div>

            <div>
              <label className="block text-sm font-medium  mb-1">Discord</label>
              <input
                type="text"
                className="w-full p-2 bg-default border border-default "
              />
            </div>

            <div>
              <label className="block text-sm font-medium  mb-1">
                Facebook
              </label>
              <input
                type="text"
                className="w-full p-2 bg-default border border-default "
              />
            </div>

            <div>
              <label className="block text-sm font-medium  mb-1">
                Instagram
              </label>
              <input
                type="text"
                className="w-full p-2 bg-default border border-default "
              />
            </div>

            <div>
              <label className="block text-sm font-medium  mb-1">Threads</label>
              <input
                type="text"
                className="w-full p-2 bg-default border border-default "
              />
            </div>

            <div>
              <label className="block text-sm font-medium  mb-1">Twitter</label>
              <input
                type="text"
                className="w-full p-2 bg-default border border-default "
              />
            </div>
          </form>
        </Accordion>
      </div>
    </div>
  );
};

export default UserProfileMaster;
