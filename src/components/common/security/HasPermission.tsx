import { UserContext } from "../../../providers/user/userProvider";
import type { BBPermission } from "../../../types/api";

const HasPermission: React.FC<{
  perms: BBPermission[];
  children: React.ReactNode;
}> = ({ perms, children }) => {
  const { permissions } = useContext(UserContext);
  const hasPerm = useMemo(() => {
    return permissions
      ?.map((p) => p.permissionName)
      .some((p) => perms.includes(p));
  }, [perms, permissions]);

  return <>{hasPerm && <span>{children}</span>}</>;
};

export default HasPermission;
