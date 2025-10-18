import { useBBQuery } from "../hooks/useBBQuery";
import type { User } from "../types/user";
import UserLeftPane from "../components/user/UserLeftPane";
import Accordion from "../components/common/accordion/Accordion";
import parse from "html-react-parser/lib/index";
import BBInput from "../components/common/forms/BBInput";

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
      <div className="col-span-12 md:col-span-9 w-full 2xl:w-1/3">
        <Accordion title="BIO INFORMATION" startExpanded>
          <form className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="block text-md font-medium mb-1 flex-auto md:flex-1/2">
                Display Name
              </label>
              <span className="flex-1/2">
                <BBInput value={user?.displayName || ""} disabled={true} />
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="block text-md font-medium mb-1 flex-auto md:flex-1/2">
                Personal Text
              </label>
              <span className="flex-1/2">
                <BBInput
                  value={user?.bioInfo?.personalText || ""}
                  disabled={true}
                />
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="block text-md font-medium mb-1 flex-auto md:flex-1/2">
                Custom Title
              </label>
              <span className="flex-1/2">
                <BBInput
                  value={user?.bioInfo?.customTitle || ""}
                  disabled={true}
                />
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="block text-md font-medium mb-1 flex-auto md:flex-1/2">
                Date of Birth
              </label>
              <span className="flex-1/2">
                <BBInput
                  placeholder="MM/dd/YYYY"
                  disabled={true}
                  value={user?.bioInfo?.birthDate || ""}
                />
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="block text-md font-medium mb-1 flex-auto md:flex-1/2">
                Gender
              </label>
              <select className="w-full p-2 bg-default border border-default flex-1/2">
                <option value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">Non-binary/Other</option>
                <option value="4">Prefer not to say</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block text-md font-medium mb-1 flex-auto md:flex-1/2">
                Signature
              </label>
              <div>
                {user?.bioInfo?.signatureParsed &&
                  parse(user?.bioInfo?.signatureParsed)}
              </div>
            </div>
          </form>
        </Accordion>

        <Accordion title="Contact Information">
          <form className="space-y-4">
            {user?.bioInfo?.hideEmailFlag === true && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <label className="block text-md font-medium mb-1 flex-auto md:flex-1/2">
                  Email Address
                </label>
                <span className="flex-1/2">
                  <BBInput
                    value={user?.contactInfo?.emailAddress?.emailAddress || ""}
                    disabled={true}
                  />
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="block text-md font-medium mb-1 flex-auto md:flex-1/2">
                Discord
              </label>
              <span className="flex-1/2">
                <BBInput value={""} disabled={true} />
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="block text-md font-medium mb-1 flex-auto md:flex-1/2">
                Facebook
              </label>
              <span className="flex-1/2">
                <BBInput value={""} disabled={true} />
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="block text-md font-medium mb-1 flex-auto md:flex-1/2">
                Instagram
              </label>
              <span className="flex-1/2">
                <BBInput value={""} disabled={true} />
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="block text-md font-medium mb-1 flex-auto md:flex-1/2">
                Threads
              </label>
              <span className="flex-1/2">
                <BBInput value={""} disabled={true} />
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="block text-md font-medium mb-1 flex-auto md:flex-1/2">
                Twitter
              </label>
              <span className="flex-1/2">
                <BBInput value={""} disabled={true} />
              </span>
            </div>
          </form>
        </Accordion>
      </div>
    </div>
  );
};

export default UserProfileMaster;
